import { Meteor } from 'meteor/meteor';
import { Messages } from './messages';

Meteor.publish('messages', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Messages.find({ $or: [{ fromUserId: this.userId }, { toUserId: this.userId }] });
});
