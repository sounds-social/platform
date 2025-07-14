import { Meteor } from 'meteor/meteor';
import { Payouts } from './payouts';
import { subDays } from 'date-fns';

export const generateMonthlyPayouts = async () => {
  console.log('Generating monthly payouts...');
  const proUsers = await Meteor.users.find({ plan: 'pro' }).fetch();
  const PRO_FEE_CENTS = 2000; // $20.00
  const SHARE_PERCENTAGE = 0.70; // 70%
  const SHARE_AMOUNT_CENTS = PRO_FEE_CENTS * SHARE_PERCENTAGE;

  for (const proUser of proUsers) {
    if (proUser.profile && proUser.profile.supports && proUser.profile.supports.length > 0) {
      const supportedMusiciansCount = proUser.profile.supports.length;
      const amountPerMusician = Math.floor(SHARE_AMOUNT_CENTS / supportedMusiciansCount);

      for (const supportedUserId of proUser.profile.supports) {
        // Check if a payout for this month already exists for this proUser to this supportedUser
        const thirtyDaysAgo = subDays(new Date(), 30);

        const existingPayout = await Payouts.findOneAsync({
          fromUserId: proUser._id,
          toUserId: supportedUserId,
          createdAt: { $gte: thirtyDaysAgo },
        });

        if (!existingPayout) {
          await Payouts.insertAsync({
            fromUserId: proUser._id,
            toUserId: supportedUserId,
            amountInCents: amountPerMusician,
            isProcessed: false,
            status: 'pending',
          });
        }
      }
    }
  }
  console.log('Monthly payouts generation complete.');
  return { success: true, message: 'Monthly payouts generated.' };
};
