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

Meteor.publish('sounds.random', async function (battleCounter) {
  check(battleCounter, Number);
  const pipeline = [
    { $match: { isPrivate: false } },
    { $sample: { size: 2 } }
  ];

  const randomSounds = await Sounds.rawCollection().aggregate(pipeline).toArray();

  randomSounds.forEach(sound => {
    this.added('sounds', sound._id, sound);
  });

  this.ready();
});

Meteor.publish('sounds.feedbackRequested', function () {
  const self = this;
  const soundsCursor = Sounds.find({ feedbackRequests: { $gte: 1 } }, { sort: { feedbackRequests: -1 } });

  soundsCursor.forEach(async (sound) => {
    self.added('sounds', sound._id, sound);
    // Publish the user associated with each sound
    const user = Meteor.users.findOneAsync(sound.userId);
    if (user) {
      self.added('users', user._id, { profile: user.profile });
    }
  });

  self.ready();
});
