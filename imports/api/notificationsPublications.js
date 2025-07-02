import { Meteor } from 'meteor/meteor';
import { Notifications } from './notifications';

Meteor.publish('notifications', function () {
  return Notifications.find({ userId: this.userId });
});
