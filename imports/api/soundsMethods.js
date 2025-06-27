import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sounds } from './sounds';

Meteor.methods({
  async 'sounds.insert'(title, description, tags, coverImage, isPrivate, backgroundImage, audioFile) {
    check(title, String);
    check(description, String);
    check(tags, Array);
    check(coverImage, String);
    check(isPrivate, Boolean);
    check(backgroundImage, String);
    check(audioFile, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Sounds.insertAsync({
      title,
      description,
      tags,
      coverImage,
      isPrivate,
      backgroundImage,
      userId: this.userId,
      audioFile
    });
  },

  async 'sounds.update'(soundId, title, description, tags, coverImage, isPrivate, backgroundImageCid) {
    check(soundId, String);
    check(title, String);
    check(description, String);
    check(tags, Array);
    check(coverImage, String);
    check(isPrivate, Boolean);
    check(backgroundImageCid, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const sound = await Sounds.findOneAsync({ _id: soundId, userId: this.userId });
    if (!sound) {
      throw new Meteor.Error('access-denied');
    }

    return await Sounds.updateAsync(soundId, {
      $set: {
        title,
        description,
        tags,
        coverImage,
        isPrivate,
        backgroundImage,
        lastUpdatedAt: new Date(),
      },
    });
  },

  async 'sounds.remove'(soundId) {
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const sound = await Sounds.findOneAsync({ _id: soundId, userId: this.userId });
    if (!sound) {
      throw new Meteor.Error('access-denied');
    }

    return await Sounds.removeAsync(soundId);
  },

  async 'sounds.incrementPlayCount'(soundId) {
    check(soundId, String);

    return await Sounds.updateAsync(soundId, {
      $inc: { playCount: 1 },
    });
  },
});
