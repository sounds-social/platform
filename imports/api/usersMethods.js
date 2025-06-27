import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  async 'users.updateProfile'(displayName, slug, avatar) {
    check(displayName, String);
    if (slug !== undefined) {
      check(slug, String);
    }
    if (avatar !== undefined) {
      check(avatar, String);
    }

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $set: {
        'profile.displayName': displayName,
        ...(slug !== undefined && { 'profile.slug': slug }),
        ...(avatar !== undefined && { 'profile.avatar': avatar }),
      },
    });
  },

  async 'users.follow'(userIdToFollow) {
    check(userIdToFollow, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Meteor.users.updateAsync(this.userId, {
      $addToSet: { 'profile.follows': userIdToFollow },
    });
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
