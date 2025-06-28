import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Sounds = new Mongo.Collection('sounds');

const SoundsSchema = new SimpleSchema({
  audioFile: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  tags: {
    type: Array,
    optional: true
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
    type: String,
  },
  likeCount: {
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
});

Sounds.attachSchema(SoundsSchema);
