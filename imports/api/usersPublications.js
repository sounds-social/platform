import { Meteor } from 'meteor/meteor';

Meteor.publish('users.view', function (slug) {
  if (!slug) {
    return this.ready();
  }

  return Meteor.users.find({
    'profile.slug': slug
  }, {
    fields: {
      'profile.displayName': 1,
      'profile.slug': 1,
      'profile.avatar': 1,
      'profile.follows': 1,
      'profile.supports': 1,
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
      emails: 1,
      profile: 1,
    }
  });
});
