import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const UserProfileSchema = new SimpleSchema({
  displayName: {
    type: String,
  },
  slug: {
    type: String,
    optional: true,
  },
  avatar: {
    type: String,
    optional: true,
  },
  follows: {
    type: Array,
    defaultValue: [],
  },
  'follows.$': {
    type: String,
  },
  supports: {
    type: Array,
    defaultValue: [],
  },
  'supports.$': {
    type: String,
  },
});

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    optional: true,
  },
  emails: {
    type: Array,
    optional: true,
  },
  "emails.$": {
    type: Object,
  },
  "emails.$.address": {
    type: String,
  },
  "emails.$.verified": {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: UserProfileSchema,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  roles: {
    type: Array,
    optional: true,
  },
  'roles.$': {
    type: String,
  },
  heartbeat: {
    type: Date,
    optional: true,
  },
});

Meteor.users.attachSchema(UserSchema);
