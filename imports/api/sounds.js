import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Sounds = new Mongo.Collection('sounds');

const SoundsSchema = new SimpleSchema({
  audioFile: {
    type: String,
  },
  title: {
    type: String,
    max: 100,
  },
  description: {
    type: String,
    optional: true,
    max: 1000,
  },
  tags: {
    type: Array,
    optional: true,
    max: 100,
  },
  'tags.$': {
    type: String,
  },
  coverImage: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
  backgroundImage: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
  },
  lastUpdatedAt: {
    type: Date,
    autoValue: () => new Date(),
  },
  playCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  likes: {
    type: Array,
    defaultValue: [],
  },
  'likes.$': {
    type: Object,
  },
  'likes.$.userId': {
    type: String,
  },
  'likes.$.likedAt': {
    type: Date,
  },
  likeCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  matchedAt: {
    type: Date,
    optional: true,
  },
  battlesWonCount: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  userId: {
    type: String,
  },
  groupId: {
    type: String,
    optional: true,
  },
  feedbackRequests: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
  isDownloadable: {
    type: Boolean,
    defaultValue: false,
  },
});

Sounds.attachSchema(SoundsSchema);
