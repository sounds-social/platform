import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Matches } from './matches';

Meteor.methods({
  async 'matches.swipe'({ swipedUserId, direction }) {
    check(swipedUserId, String);
    check(direction, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const action = direction === 'left' ? 'dislike' : 'like';

    await Matches.upsertAsync(
      {
        userId: this.userId,
        swipedUserId,
      },
      {
        $set: {
          action,
        },
      }
    );

    if (action === 'like') {
      const reciprocalMatch = await Matches.findOneAsync({
        userId: swipedUserId,
        swipedUserId: this.userId,
        action: 'like',
      });

      if (reciprocalMatch) {
        await Matches.updateAsync(
          {
            $or: [
              { userId: this.userId, swipedUserId: swipedUserId },
              { userId: swipedUserId, swipedUserId: this.userId },
            ],
          },
          {
            $set: {
              matched: true,
            },
          },
          { multi: true }
        );

        return { matched: true, swipedUserId };
      }
    }
  },
});
