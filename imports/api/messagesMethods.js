import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Messages } from './messages';

Meteor.methods({
  async 'messages.send'(toUserId, message) {
    check(toUserId, String);
    check(message, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    return await Messages.insertAsync({
      fromUserId: this.userId,
      toUserId,
      message,
    });
  },
  async 'messages.markAsRead'(messageId) {
    check(messageId, String);

    const message = await Messages.findOneAsync(messageId);

    if (!message) {
      throw new Meteor.Error('not-found', 'Message not found');
    }

    if (message.toUserId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to mark this message as read');
    }

    return await Messages.updateAsync(messageId, { $set: { isRead: true } });
  },
  async 'messages.markConversationAsRead'(otherUserId) {
    check(otherUserId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in.');
    }

    return await Messages.updateAsync(
      { fromUserId: otherUserId, toUserId: this.userId, isRead: false },
      { $set: { isRead: true } },
      { multi: true }
    );
  }
});
