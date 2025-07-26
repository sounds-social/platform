import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Feedback } from './feedback';

Meteor.methods({
  'feedback.insert': async function (soundId, content, rating) {
    check(soundId, String);
    check(content, String);
    check(rating, Number);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to give feedback.');
    }

    if (content.length < 50 || content.length > 1000) {
      throw new Meteor.Error('invalid-content', 'Feedback content must be between 50 and 1000 characters.');
    }

    if (rating < 1 || rating > 5) {
      throw new Meteor.Error('invalid-rating', 'Rating must be between 1 and 5.');
    }

    await Feedback.insertAsync({
      soundId,
      giverId: this.userId,
      content,
      rating,
      createdAt: new Date(),
    });

    // Update feedbackCoins for the giver
    const user = await Meteor.users.findOneAsync(this.userId);
    if (user) {
      let newFeedbackCoins = (user.profile?.feedbackCoins || 0) + 0.5;
      if (newFeedbackCoins > 10) {
        newFeedbackCoins = 10;
      }
      await Meteor.users.updateAsync(this.userId, { $set: { 'profile.feedbackCoins': newFeedbackCoins } });
    }
  },
});
