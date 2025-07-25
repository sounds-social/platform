import { Meteor } from 'meteor/meteor';
import { Matches } from './matches';

Meteor.publish('matches.own', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Matches.find({ userId: this.userId });
});

Meteor.publish('matches.matched', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Matches.find({
    $or: [
      { userId: this.userId, matched: true },
      { swipedUserId: this.userId, matched: true },
    ],
  });
});
