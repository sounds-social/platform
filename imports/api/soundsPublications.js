import { Meteor } from 'meteor/meteor';
import { Sounds } from './sounds';

Meteor.publish('sounds.public', function () {
  return Sounds.find({ isPrivate: false });
});

Meteor.publish('sounds.private', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Sounds.find({ userId: this.userId });
});

Meteor.publish('sounds.userPublic', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Sounds.find({ userId: userId, isPrivate: false });
});

Meteor.publish('sounds.likedByUser', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Sounds.find({ likes: userId });
});

Meteor.publish('sounds.byIds', function (soundIds) {
  check(soundIds, Array);
  check(soundIds.every(id => typeof id === 'string'), true);
  return Sounds.find({ _id: { $in: soundIds } });
});