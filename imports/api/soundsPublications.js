import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sounds } from './sounds';

Meteor.publish('sounds.public', function () {
  return Sounds.find({ isPrivate: false }, { fields: { audioFile: 0 } });
});

Meteor.publish('sounds.private', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Sounds.find({ userId: this.userId }, { fields: { audioFile: 0 } });
});

Meteor.publish('sounds.userPublic', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Sounds.find({ userId: userId, isPrivate: false }, { fields: { audioFile: 0 } });
});

Meteor.publish('sounds.likedByUser', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Sounds.find({ 'likes.userId': userId }, { fields: { audioFile: 0 } });
});

Meteor.publish('sounds.byIds', function (soundIds) {
  check(soundIds, Array);
  check(soundIds.every(id => typeof id === 'string'), true);
  return Sounds.find({ _id: { $in: soundIds } }, { fields: { audioFile: 0 } });
});

Meteor.publish('sounds.singleSound', async function (soundId) {
  check(soundId, String);
  const sound = await Sounds.findOneAsync(soundId);

  if (!sound) {
    return this.ready();
  }

  if (sound.isPrivate === false || this.userId === sound.userId) {
    return Sounds.find({ _id: soundId }, { fields: { audioFile: 0 } });
  } else {
    return this.ready();
  }
});

Meteor.publish('sounds.random', async function (battleCounter) {
  check(battleCounter, Number);
  const pipeline = [
    { $match: { isPrivate: false } },
    { $sample: { size: 2 } },
    { $project: { audioFile: 0 } }
  ];

  const randomSounds = await Sounds.rawCollection().aggregate(pipeline).toArray();

  randomSounds.forEach(sound => {
    this.added('sounds', sound._id, sound);
  });

  this.ready();
});
