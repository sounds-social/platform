import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sounds } from '../imports/api/sounds';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function downloadFile(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve(true);
      }
    });
  });
}

Meteor.methods({
  async 'snippets.create'(soundId, startTime, endTime) {
    check(soundId, String);
    check(startTime, Number);
    check(endTime, Number);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const sound = await Sounds.findOneAsync(soundId);

    if (!sound) {
      throw new Meteor.Error('Sound not found.');
    }
    
    const user = await Meteor.users.findOneAsync(sound.userId);
    const userName = user ? user.profile.displayName : 'Unknown';

    const tempDir = path.join('/tmp', soundId);
    await fs.ensureDir(tempDir);

    const audioPath = path.join(tempDir, 'audio.mp3');
    const imagePath = path.join(tempDir, 'cover.jpg');
    const snippetFileName = `snippet-${soundId}.mp4`;
    const tempSnippetPath = path.join(tempDir, snippetFileName);

    try {
      await downloadFile(sound.audioFile, audioPath);
      await downloadFile(sound.coverImage, imagePath);

      const regularFontPath = Assets.absoluteFilePath('fonts/Roboto-Regular.ttf');
      if (!fs.existsSync(regularFontPath)) {
        throw new Meteor.Error('font-not-found', 'Font file not found. Please add Roboto-Regular.ttf to the private/fonts directory.');
      }
      const boldFontPath = Assets.absoluteFilePath('fonts/Roboto-Bold.ttf');
      if (!fs.existsSync(boldFontPath)) {
        throw new Meteor.Error('font-not-found', 'Font file not found. Please add Roboto-Bold.ttf to the private/fonts directory.');
      }

      const tempRegularFontPath = path.join(tempDir, 'Roboto-Regular.ttf');
      await fs.copy(regularFontPath, tempRegularFontPath);
      const tempBoldFontPath = path.join(tempDir, 'Roboto-Bold.ttf');
      await fs.copy(boldFontPath, tempBoldFontPath);

      return new Promise((resolve, reject) => {
        ffmpeg()
          .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
          })
          .input(audioPath)
          .setStartTime(startTime)
          .setDuration(endTime - startTime)
          .input(imagePath)
          .complexFilter([
            '[1:v]scale=1000:1000[bg]',
            '[0:a]showwaves=s=1280x100:mode=line:rate=25,colorkey=0x000000:0.01:0.1[waveform]',
            '[bg][waveform]overlay=0:H-h-20[bg_waveform]',
            {
              filter: 'drawtext',
              options: {
                fontfile: tempBoldFontPath,
                text: sound.title,
                fontcolor: 'white',
                fontsize: 50,
                x: '(w-text_w)/2',
                y: 50,
                shadowcolor: 'black',
                shadowx: 2,
                shadowy: 2
              },
              inputs: 'bg_waveform',
              outputs: 'bg_waveform_text'
            },
            {
              filter: 'drawtext',
              options: {
                fontfile: tempRegularFontPath,
                text: `by ${userName}`,
                fontcolor: 'white',
                fontsize: 30,
                x: '(w-text_w)/2',
                y: 120,
                shadowcolor: 'black',
                shadowx: 2,
                shadowy: 2
              },
              inputs: 'bg_waveform_text',
              outputs: 'bg_waveform_text_2'
            },
            {
              filter: 'drawtext',
              options: {
                fontfile: tempRegularFontPath,
                text: 'Sounds Social',
                fontcolor: 'white',
                fontsize: 20,
                x: 'w-text_w-20',
                y: 'h-text_h-20',
                shadowcolor: 'black',
                shadowx: 2,
                shadowy: 2
              },
              inputs: 'bg_waveform_text_2',
            }
          ])
          .output(tempSnippetPath)
          .on('end', async () => {
            try {
              const snippetData = await fs.readFile(tempSnippetPath, { encoding: 'base64' });
              resolve(`data:video/mp4;base64,${snippetData}`);
            } catch (readError) {
              reject(new Meteor.Error('file-read-error', readError.message));
            } finally {
              await fs.remove(tempDir);
            }
          })
          .on('error', async (err) => {
            reject(new Meteor.Error('ffmpeg-error', err.message));
            await fs.remove(tempDir);
          })
          .run();
      });
    } catch (error) {
      await fs.remove(tempDir);
      throw new Meteor.Error('file-download-error', error.message);
    }
  },
});
