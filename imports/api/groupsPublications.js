import { Meteor } from 'meteor/meteor';
import { Groups } from './groups';

Meteor.publish('groups.view', function (slug) {
    if (!slug) {
        return this.ready();
    }
    return Groups.find({ slug: slug });
});

Meteor.publish('groups.byUser', function (userId) {
  if (!userId) {
    return this.ready();
  }
  return Groups.find({ members: userId });
});