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

  async 'users.support'(userIdToSupport) {
    check(userIdToSupport, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $addToSet: { 'profile.supports': userIdToSupport },
    });
  },

  async 'users.unsupport'(userIdToUnsupport) {
    check(userIdToUnsupport, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $pull: { 'profile.supports': userIdToUnsupport },
    });
  },
});
