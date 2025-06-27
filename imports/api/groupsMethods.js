import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Groups } from './groups';

Meteor.methods({
  async 'groups.insert'(name, slug, members) {
    check(name, String);
    check(slug, String);
    check(members, Array);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // You might want to add a check to ensure the user is an admin/owner of the group

    return await Groups.insertAsync({
      name,
      slug,
      members,
    });
  },

  async 'groups.update'(groupId, name, slug, members) {
    check(groupId, String);
    check(name, String);
    check(slug, String);
    check(members, Array);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // You might want to add a check to ensure the user is an admin/owner of the group

    return await Groups.updateAsync(groupId, {
      $set: {
        name,
        slug,
        members,
      },
    });
  },

  async 'groups.remove'(groupId) {
    check(groupId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // You might want to add a check to ensure the user is an admin/owner of the group

    return await Groups.removeAsync(groupId);
  },
});
