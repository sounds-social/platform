import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Feedback } from './feedback';
import { Sounds } from './sounds';

Meteor.publish('feedback.forUser', async function () {
  if (!this.userId) {
    return this.ready();
  }
  const userSoundIds = await Sounds.find({ userId: this.userId }).map(s => s._id);
  const feedbacks = await Feedback.find({ soundId: { $in: userSoundIds } }, { sort: { createdAt: -1 } });

  feedbacks.forEach(async (feedback) => {
    const sound = await Sounds.findOneAsync(feedback.soundId);
    if (sound) {
      this.added('sounds', sound._id, sound);
    }
    const giver = await Meteor.users.findOneAsync(feedback.giverId);
    if (giver) {
      this.added('users', giver._id, { profile: giver.profile });
    }
  });

  return feedbacks;
});
