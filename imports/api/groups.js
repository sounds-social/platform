import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Groups = new Mongo.Collection('groups');

const GroupsSchema = new SimpleSchema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  members: {
    type: Array,
    defaultValue: [],
  },
  'members.$': {
    type: String,
  },
});

Groups.attachSchema(GroupsSchema);
