import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Feedback } from './feedback';
import { Sounds } from './sounds';

Meteor.publish('feedback.forUser', async function () {
  if (!this.userId) {
    return this.ready();
  }
  const userSoundIds = (await Sounds.find({ userId: this.userId }).fetchAsync()).map(s => s._id);
  const feedbacks = Feedback.find({ soundId: { $in: userSoundIds } }, { sort: { createdAt: -1 } });
  const giverIds = (await feedbacks.fetchAsync()).map(f => f.giverId);

  const sounds = Sounds.find({ _id: { $in: userSoundIds } });
  const users = Meteor.users.find({ _id: { $in: giverIds } }, { fields: { profile: 1 } });

  return [feedbacks, sounds, users];
});

Meteor.publish('feedback.givenByUser', async function () {
  if (!this.userId) {
    return this.ready();
  }

  const feedbacks = Feedback.find({ giverId: this.userId }, { sort: { createdAt: -1 } });
  const soundIds = (await feedbacks.fetchAsync()).map(f => f.soundId);

  // Publish related sounds
  const sounds = Sounds.find({ _id: { $in: soundIds } });

  // Publish related users (the users who received the feedback)
  const userIds = (await sounds.fetchAsync()).map(s => s.userId);
  const users = Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } });

  return [feedbacks, sounds, users];
});
""
