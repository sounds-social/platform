import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const UserProfileSchema = new SimpleSchema({
  displayName: {
    type: String,
    max: 100,
  },
  slug: {
    type: String,
    optional: true,
    max: 100,
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
  followers: {
    type: Array,
    defaultValue: [],
  },
  'followers.$': {
    type: String,
  },
  youtube: {
    type: String,
    optional: true,
  },
  twitter: {
    type: String,
    optional: true,
  },
  spotify: {
    type: String,
    optional: true,
  },
  instagram: {
    type: String,
    optional: true,
  },
  website: {
    type: String,
    optional: true,
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
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
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
