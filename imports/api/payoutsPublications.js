import { Meteor } from 'meteor/meteor';
import { Payouts } from './payouts';

Meteor.publish('payouts.myPayouts', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Payouts.find({ toUserId: this.userId });
});
