import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sounds } from './sounds';
import { Notifications } from './notifications';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import similarity from 'similarity';

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

    if (audioFile.trim() === '' || coverImage.trim() === '') {
      throw new Meteor.Error('invalid-input', 'Audio file and cover image are required.');
    }

    const soundId = await Sounds.insertAsync({
      title,
      description,
      tags,
      coverImage,
      isPrivate,
      backgroundImage,
      userId: this.userId,
      audioFile,
    });

    const uploader = await Meteor.users.findOneAsync(this.userId);
    const followers = await Meteor.users.find({ 'profile.follows': this.userId }).fetch();

    for (const follower of followers) {
      await Notifications.insertAsync({
        userId: follower._id,
        message: `${uploader.profile.displayName} uploaded a new sound: ${title}`,
        link: `/sound/${soundId}`,
      });
    }

    return soundId;
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

    if (coverImage.trim() === '') {
      throw new Meteor.Error('invalid-input', 'Cover image is required.');
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
      backgroundImage,
      coverImage
    };

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
  },

  async 'sounds.winBattle'(soundId) {
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Sounds.updateAsync(soundId, {
      $inc: { battlesWonCount: 1 },
    });
  },

  async 'sounds.getSimilar'({ soundId }) {
    check(soundId, String);

    const sound = await Sounds.findOneAsync(soundId);
    if (!sound) {
      throw new Meteor.Error('not-found', 'Sound not found');
    }

    const allSounds = await Sounds.find({ _id: { $ne: soundId }, isPrivate: { $ne: true } }).fetch();
    const soundsWithSimilarity = allSounds.map(otherSound => {
      const titleSimilarity = similarity(sound.title, otherSound.title);
      const descriptionSimilarity = similarity(sound.description, otherSound.description);
      const tagsSimilarity = similarity((sound.tags || []).join(' '), (otherSound.tags || []).join(' '));
      
      const totalSimilarity = (titleSimilarity * 0.5) + (descriptionSimilarity * 0.3) + (tagsSimilarity * 0.2);

      return {
        ...otherSound,
        similarity: totalSimilarity,
      };
    });

    return soundsWithSimilarity.sort((a, b) => b.similarity - a.similarity).slice(0, 20);
  },
});

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    type: 'method',
    name: 'sounds.incrementPlayCount',
    userId(userId) {
      return true;
    },
  }, 1, 1000); // 1 call per 1 second (1000ms) per connection/user
}
