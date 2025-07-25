import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Matches } from './matches';
import { Sounds } from './sounds';
import { Notifications } from './notifications';

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
              matchedAt: new Date(),
            },
          },
          { multi: true }
        );

        const currentUser = await Meteor.users.findOneAsync(this.userId);
        const swipedUser = await Meteor.users.findOneAsync(swipedUserId);

        if (currentUser && swipedUser) {
          await Notifications.insertAsync({
            userId: this.userId,
            message: `You matched with ${swipedUser.profile.firstName}! Send them a DM to get started`,
            link: `/profile/${swipedUser.profile.slug}`,
          });

          await Notifications.insertAsync({
            userId: swipedUserId,
            message: `You matched with ${currentUser.profile.firstName}! Send them a DM to get started`,
            link: `/profile/${currentUser.profile.slug}`,
          });
        }

        return { matched: true, swipedUserId };
      }
    }
  },
});
