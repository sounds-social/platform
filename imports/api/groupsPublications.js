import { Meteor } from 'meteor/meteor';
import { Groups } from './groups';

Meteor.publish('groups.view', function (slug) {
    if (!slug) {
        return this.ready();
    }
    return Groups.find({ slug: slug });
});
