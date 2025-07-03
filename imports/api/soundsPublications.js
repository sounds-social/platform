import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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
  return Sounds.find({ 'likes.userId': userId });
});

Meteor.publish('sounds.byIds', function (soundIds) {
  check(soundIds, Array);
  check(soundIds.every(id => typeof id === 'string'), true);
  return Sounds.find({ _id: { $in: soundIds } });
});

Meteor.publish('sounds.singleSound', async function (soundId) {
  check(soundId, String);
  const sound = await Sounds.findOneAsync(soundId);

  if (!sound) {
    return this.ready();
  }

  if (sound.isPrivate === false || this.userId === sound.userId) {
    return Sounds.find({ _id: soundId });
  } else {
    return this.ready();
  }
});
