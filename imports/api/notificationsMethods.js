import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notifications } from './notifications';

Meteor.methods({
  async 'notifications.markAsRead'(notificationId) {
    check(notificationId, String);

    const notification = await Notifications.findOneAsync(notificationId);

    if (!notification) {
      throw new Meteor.Error('not-found', 'Notification not found');
    }

    if (notification.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to mark this notification as read');
    }

    return await Notifications.updateAsync(notificationId, { $set: { isRead: true } });
  },
});
