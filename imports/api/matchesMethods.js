import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Matches } from './matches';

Meteor.methods({
  'matches.swipe'({ swipedUserId, action }) {
    check(swipedUserId, String);
    check(action, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Matches.upsert(
      {
        userId: this.userId,
        swipedUserId,
      },
      {
        $set: {
          action,
        },
      }
    );
  },
});
