import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Feedback } from './feedback';
import { Sounds } from './sounds';

Meteor.publish('feedback.forUser', async function () {
  if (!this.userId) {
    return this.ready();
  }
  const userSoundIds = await Sounds.find({ userId: this.userId }).map(s => s._id);

  return Feedback.find({ soundId: { $in: userSoundIds } }, { sort: { createdAt: -1 } });
});
