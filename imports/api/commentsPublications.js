import { Meteor } from 'meteor/meteor';
import { Comments } from './comments';

Meteor.publish('comments.forSound', function (soundId) {
  if (!soundId) {
    return this.ready();
  }
  return Comments.find({ soundId: soundId });
});

Meteor.publish('comments.byUser', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Comments.find({ userId: userId });
});