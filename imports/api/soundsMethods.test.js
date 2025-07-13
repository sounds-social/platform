import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { Sounds } from './sounds';
import './soundsMethods';

describe('soundsMethods', () => {
  if (Meteor.isServer) {
    beforeEach(async () => {
      await Sounds.removeAsync({}); // Clear the collection before each test
    });

    describe('sounds.insert', () => {
      it('should insert a new sound', async () => {
        const userId = Random.id();
        const title = 'Test Sound';
        const description = 'Test Description';
        const tags = ['test'];
        const coverImage = 'cover.jpg';
        const isPrivate = false;
        const backgroundImage = 'background.jpg';
        const audioFile = 'audio.mp3';

        await mockMethodCall('sounds.insert', title, description, tags, coverImage, isPrivate, backgroundImage, audioFile, { context: { userId } });

        const sound = await Sounds.findOneAsync({ title });
        assert.isDefined(sound);
        assert.equal(sound.userId, userId);
      });

      it('should not insert a new sound if not logged in', async () => {
        const title = 'Test Sound';
        const description = 'Test Description';
        const tags = ['test'];
        const coverImage = 'cover.jpg';
        const isPrivate = false;
        const backgroundImage = 'background.jpg';
        const audioFile = 'audio.mp3';

        try {
          await mockMethodCall('sounds.insert', title, description, tags, coverImage, isPrivate, backgroundImage, audioFile);
        } catch (error) {
          assert.equal(error.error, 'not-authorized');
        }
      });
    });

    describe('sounds.update', () => {
      it('should update a sound', async () => {
        const userId = Random.id();
        const soundId = await Sounds.insertAsync({ title: 'Test Sound', userId, audioFile: 'audio.mp3', coverImage: 'cover.jpg' });
        const title = 'Updated Sound';
        const description = 'Updated Description';
        const tags = ['updated'];
        const coverImage = 'updated-cover.jpg';
        const isPrivate = true;
        const backgroundImage = 'updated-background.jpg';

        await mockMethodCall('sounds.update', soundId, title, description, tags, coverImage, isPrivate, backgroundImage, { context: { userId } });

        const sound = await Sounds.findOneAsync(soundId);
        assert.equal(sound.title, title);
        assert.equal(sound.isPrivate, isPrivate);
      });

      it('should not update a sound if not the owner', async () => {
        const ownerId = Random.id();
        const soundId = await Sounds.insertAsync({ title: 'Test Sound', userId: ownerId, audioFile: 'audio.mp3', coverImage: 'cover.jpg' });
        const userId = Random.id();
        const title = 'Updated Sound';
        const description = 'Updated Description';
        const tags = ['updated'];
        const coverImage = 'updated-cover.jpg';
        const isPrivate = true;
        const backgroundImage = 'updated-background.jpg';

        try {
          await mockMethodCall('sounds.update', soundId, title, description, tags, coverImage, isPrivate, backgroundImage, { context: { userId } });
        } catch (error) {
          assert.equal(error.error, 'access-denied');
        }
      });
    });

    describe('sounds.remove', () => {
      it('should remove a sound', async () => {
        const userId = Random.id();
        const soundId = await Sounds.insertAsync({ title: 'Test Sound', userId, audioFile: 'audio.mp3', coverImage: 'cover.jpg' });

        await mockMethodCall('sounds.remove', soundId, { context: { userId } });

        const sound = await Sounds.findOneAsync(soundId);
        assert.isUndefined(sound);
      });

      it('should not remove a sound if not the owner', async () => {
        const ownerId = Random.id();
        const soundId = await Sounds.insertAsync({ title: 'Test Sound', userId: ownerId, audioFile: 'audio.mp3', coverImage: 'cover.jpg' });
        const userId = Random.id();

        try {
          await mockMethodCall('sounds.remove', soundId, { context: { userId } });
        } catch (error) {
          assert.equal(error.error, 'access-denied');
        }
      });
    });
  }
});