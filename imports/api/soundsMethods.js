import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sounds } from './sounds';
import { Notifications } from './notifications';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import similarity from 'similarity';

Meteor.methods({
  async 'sounds.insert'(title, description, tags, coverImage, isPrivate, backgroundImage, audioFile, isDownloadable) {
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
      isDownloadable: !!isDownloadable,
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

  async 'sounds.update'(soundId, title, description, tags, coverImage, isPrivate, backgroundImage, isDownloadable) {
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
      coverImage,
      isDownloadable: !!isDownloadable
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
      const tagsSimilarity = similarity((sound.tags || []).join(' '), (otherSound.tags || []).join(' '));
      
      const totalSimilarity = (titleSimilarity * 0.5) + (tagsSimilarity * 0.5);

      return {
        ...otherSound,
        similarity: totalSimilarity,
      };
    });

    return soundsWithSimilarity.sort((a, b) => b.similarity - a.similarity).slice(0, 20);
  },

  async 'sounds.requestFeedback'(soundId, requests) {
    check(soundId, String);
    check(requests, Number);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to request feedback.');
    }

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found.');
    }

    const sound = await Sounds.findOneAsync(soundId);
    if (!sound) {
      throw new Meteor.Error('sound-not-found', 'Sound not found.');
    }

    if (requests < 1 || requests > 10) {
      throw new Meteor.Error('invalid-requests', 'You can request between 1 and 10 feedbacks at a time.');
    }

    if (sound.userId !== this.userId) {
      throw new Meteor.Error('not-owner', 'You can only request feedback for your own sounds.');
    }

    const currentFeedbackCoins = user.profile?.feedbackCoins || 0;
    if (currentFeedbackCoins < requests) {
      throw new Meteor.Error(
        'not-enough-coins', 
        `You do not have enough feedback coins. You have ${currentFeedbackCoins} coin${
          currentFeedbackCoins === 1 ? '' : 's'
        } to spend.`
      );
    }

    // Decrement user's feedbackCoins
    await Meteor.users.updateAsync(this.userId, { $inc: { 'profile.feedbackCoins': -requests } });

    // Increment sound's feedbackRequests
    await Sounds.updateAsync(soundId, { $inc: { feedbackRequests: requests } });
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
