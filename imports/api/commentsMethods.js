import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Comments } from './comments';
import { Sounds } from './sounds';
import { Notifications } from './notifications';

Meteor.methods({
  async 'comments.insert'(soundId, content, timestamp) {
    timestamp = parseInt(timestamp, 10) || 0;

    check(soundId, String);
    check(content, String);
    check(timestamp, Number);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const sound = await Sounds.findOneAsync(soundId);
    if (!sound) {
      throw new Meteor.Error('not-found', 'Sound not found');
    }

    const commentId = await Comments.insertAsync({
      soundId,
      content,
      timestamp,
      userId: this.userId,
    });

    if (this.userId !== sound.userId) {
      const commenter = await Meteor.users.findOneAsync(this.userId);
      await Notifications.insertAsync({
        userId: sound.userId,
        message: `${commenter.profile.displayName} commented on your sound ${sound.title}`,
        link: `/sound/${soundId}`,
      });
    }

    return commentId;
  },

  async 'comments.update'(commentId, content) {
    check(commentId, String);
    check(content, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const comment = await Comments.findOneAsync({ _id: commentId, userId: this.userId });
    if (!comment) {
      throw new Meteor.Error('access-denied');
    }

    return await Comments.updateAsync(commentId, {
      $set: {
        content,
        lastUpdatedAt: new Date(),
      },
    });
  },

  async 'comments.remove'(commentId) {
    check(commentId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const comment = await Comments.findOneAsync({ _id: commentId, userId: this.userId });
    if (!comment) {
      throw new Meteor.Error('access-denied');
    }

    return await Comments.removeAsync(commentId);
  },
});
