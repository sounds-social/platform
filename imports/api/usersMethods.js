import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Notifications } from './notifications';

Meteor.methods({
  async 'users.updateProfile'(displayName, slug, avatar, youtube, twitter, spotify, instagram, website) {
    check(displayName, String);
    if (slug !== undefined) {
      check(slug, String);
      const user = await Meteor.users.findOneAsync({ 'profile.slug': slug });
      if (user && user._id !== this.userId) {
        throw new Meteor.Error('slug-already-exists', 'This slug is already in use.');
      }
    }
    if (avatar !== undefined) {
      check(avatar, String);
    }
    if (youtube !== undefined) {
      check(youtube, String);
    }
    if (twitter !== undefined) {
      check(twitter, String);
    }
    if (spotify !== undefined) {
      check(spotify, String);
    }
    if (instagram !== undefined) {
      check(instagram, String);
    }
    if (website !== undefined) {
      check(website, String);
    }

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $set: {
        'profile.displayName': displayName,
        ...(slug !== undefined && { 'profile.slug': slug }),
        ...(avatar !== undefined && { 'profile.avatar': avatar }),
        ...(youtube !== undefined && { 'profile.youtube': youtube }),
        ...(twitter !== undefined && { 'profile.twitter': twitter }),
        ...(spotify !== undefined && { 'profile.spotify': spotify }),
        ...(instagram !== undefined && { 'profile.instagram': instagram }),
        ...(website !== undefined && { 'profile.website': website }),
      },
    });
  },

  async 'users.follow'(userIdToFollow) {
    check(userIdToFollow, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const result = await Meteor.users.updateAsync(this.userId, {
      $addToSet: { 'profile.follows': userIdToFollow },
    });

    if (result) {
      await Meteor.users.updateAsync(userIdToFollow, {
        $addToSet: { 'profile.followers': this.userId },
      });

      const currentUser = await Meteor.users.findOneAsync(this.userId);
      await Notifications.insertAsync({
        userId: userIdToFollow,
        message: `${currentUser.profile.displayName} started following you`,
        link: `/profile/${currentUser.profile.slug}`,
      });
    }

    return result;
  },

  async 'users.unfollow'(userIdToUnfollow) {
    check(userIdToUnfollow, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await Meteor.users.updateAsync(this.userId, {
      $pull: { 'profile.follows': userIdToUnfollow },
    });

    return await Meteor.users.updateAsync(userIdToUnfollow, {
      $pull: { 'profile.followers': this.userId },
    });
  },

  async 'users.addSupporter'(userIdToSupport) {
    check(userIdToSupport, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const result = await Meteor.users.updateAsync(userIdToSupport, {
      $addToSet: { 'profile.supporters': this.userId },
    });

    if (result) {
      await Meteor.users.updateAsync(this.userId, {
        $addToSet: { 'profile.supports': userIdToSupport },
      });
      const currentUser = await Meteor.users.findOneAsync(this.userId);
      await Notifications.insertAsync({
        userId: userIdToSupport,
        message: `${currentUser.profile.displayName} is now supporting you`,
        link: `/profile/${currentUser.profile.slug}`,
      });
    }
    return result;
  },

  async 'users.removeSupporter'(userIdToUnsupport) {
    check(userIdToUnsupport, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await Meteor.users.updateAsync(this.userId, {
      $pull: { 'profile.supports': userIdToUnsupport },
    });

    return await Meteor.users.updateAsync(userIdToUnsupport, {
      $pull: { 'profile.supporters': this.userId },
    });
  },

  async 'users.setPlan'(plan) {
    check(plan, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $set: { plan },
    });
  },

  async 'users.resetPlanToFree'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $set: { plan: '' },
    });
  },

  async 'stripe.createCheckoutSession'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const stripe = require('stripe')(Meteor.settings.private.stripe.secretKey);
    const user = await Meteor.users.findOneAsync(this.userId);

    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: Meteor.settings.private.stripe.proPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: Meteor.absoluteUrl('stripe-success?session_id={CHECKOUT_SESSION_ID}').replace('soundssocial.eu.meteorapp.com', 'soundssocial.io'),
      cancel_url: Meteor.absoluteUrl('go-pro').replace('soundssocial.eu.meteorapp.com', 'soundssocial.io'),
      client_reference_id: this.userId,
      customer_email: user.emails[0].address,
    });

    return session.url;
  },

  async 'stripe.checkPaymentStatus'(sessionId) {
    check(sessionId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const stripe = require('stripe')(Meteor.settings.private.stripe.secretKey);

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        // Update user's plan to pro
        await Meteor.users.updateAsync(this.userId, {
          $set: { plan: 'pro' },
        });
        return { success: true };
      } else {
        return { success: false, message: 'Payment not successful.' };
      }
    } catch (error) {
      console.error('Error checking Stripe payment status:', error);
      throw new Meteor.Error('stripe-error', 'Failed to check payment status.');
    }
  },
});
