
import { Meteor } from 'meteor/meteor';

const stripe = require('stripe')(Meteor.settings.private.stripe.secretKey);

export const checkProUsersSubscriptionStatus = async () => {
  console.log('Checking pro users subscription status...');

  const proUsers = await Meteor.users.find({ plan: 'pro' }).fetch();

  for (const user of proUsers) {
    if (!user.services?.stripe?.customerId) {
      continue;
    }

    const customerId = user.services.stripe.customerId;
    console.log(`Checking subscription for PRO user ${user._id} (${customerId})...`);

    try {
      const customer = await stripe.customers.retrieve(customerId, {
        expand: ['subscriptions'],
      });

      if (customer.subscriptions.data.length === 0) {
        console.log(`No subscriptions found for user ${user._id}. Setting plan to '' (free).`);
        await Users.updateAsync(user._id, {
          $set: { plan: '' },
        });
      }
    } catch (error) {
      console.error(`Error checking subscription for user ${user._id}:`, error);
    }
  }

  console.log('Checking subscription status complete.');
};
