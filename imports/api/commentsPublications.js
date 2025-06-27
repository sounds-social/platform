import { Meteor } from 'meteor/meteor';
import { Comments } from './comments';

Meteor.publish('comments.forSound', function (soundId) {
  if (!soundId) {
    return this.ready();
  }
  return Comments.find({ soundId: soundId });
});
