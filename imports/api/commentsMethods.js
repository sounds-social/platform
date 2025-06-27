import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Comments } from './comments';

Meteor.methods({
  async 'comments.insert'(soundId, content, timestamp) {
    check(soundId, String);
    check(content, String);
    check(timestamp, Number);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Comments.insertAsync({
      soundId,
      content,
      timestamp,
      userId: this.userId,
    });
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
