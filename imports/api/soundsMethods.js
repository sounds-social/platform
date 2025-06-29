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

  async 'sounds.update'(soundId, title, description, tags, coverImage, isPrivate, backgroundImage) {
    check(soundId, String);
    check(title, String);
    check(description, String);
    check(tags, Array);
    check(coverImage, String);
    check(isPrivate, Boolean);
    check(backgroundImage, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const sound = await Sounds.findOneAsync({ _id: soundId, userId: this.userId });
    if (!sound) {
      throw new Meteor.Error('access-denied');
    }

    const fieldsToUpdate = {
      title,
      description,
      tags,
      isPrivate,
      lastUpdatedAt: new Date(),
    };

    if (coverImage) fieldsToUpdate.coverImage = coverImage;
    if (backgroundImage) fieldsToUpdate.backgroundImage = backgroundImage;

    return await Sounds.updateAsync(soundId, {
      $set: fieldsToUpdate,
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

  async 'sounds.toggleLike'(soundId) {
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const sound = await Sounds.findOneAsync(soundId);

    if (!sound) {
      throw new Meteor.Error('sound-not-found');
    }

    const userHasLiked = sound.likes && sound.likes.some(like => like.userId === this.userId);

    if (userHasLiked) {
      return await Sounds.updateAsync(soundId, {
        $pull: { likes: { userId: this.userId } },
        $inc: { likeCount: -1 },
      });
    } else {
      return await Sounds.updateAsync(soundId, {
        $addToSet: { likes: { userId: this.userId, likedAt: new Date() } },
        $inc: { likeCount: 1 },
      });
    }
  },

  async 'sounds.getLikedSoundsCount'(userId) {
    check(userId, String);
    return await Sounds.find({ likes: userId }).countAsync();
  }
});
