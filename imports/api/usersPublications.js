import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('users.view', function (slug) {
  if (!slug) {
    return this.ready();
  }

  return Meteor.users.find({
    'profile.slug': slug
  }, {
    fields: {
      plan: 1,
      'profile.displayName': 1,
      'profile.slug': 1,
      'profile.avatar': 1,
      'profile.follows': 1,
      'profile.supporters': 1,
      'profile.supports': 1,
      'profile.followers': 1,
      'profile.youtube': 1,
      'profile.twitter': 1,
      'profile.spotify': 1,
      'profile.instagram': 1,
      'profile.website': 1,
    }
  });
});

Meteor.publish('users.me', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      plan: 1,
      emails: 1,
      profile: 1,
    }
  });
});

Meteor.publish('users.public', function () {
  return Meteor.users.find({}, {
    fields: {
      plan: 1,
      'profile.displayName': 1,
      'profile.slug': 1,
      'profile.avatar': 1,
      'profile.follows': 1,
      'profile.supporters': 1,
      'profile.supports': 1,
      'profile.followers': 1,
      'profile.youtube': 1,
      'profile.twitter': 1,
      'profile.spotify': 1,
      'profile.instagram': 1,
      'profile.website': 1,
    }
  });
});

Meteor.publish('users.supportedUsers', function (userIds) {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({
    _id: { $in: userIds }
  }, {
    fields: {
      'profile.displayName': 1,
      'profile.slug': 1,
      'profile.avatar': 1,
    }
  });
});

Meteor.publish('users.byIds', function (userIds) {
  check(userIds, [String]);

  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({
    _id: { $in: userIds }
  }, {
    fields: {
      'profile.displayName': 1,
      'profile.slug': 1,
    }
  });
});

Meteor.publish('users.all', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({}, {
    fields: {
      profile: 1,
    }
  });
});
