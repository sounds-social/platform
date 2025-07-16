import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PlaylistsCollection = new Mongo.Collection('playlists');

PlaylistsCollection.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

const PlaylistsSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    max: 100
  },
  description: {
    type: String,
    optional: true,
    max: 1000,
  },
  isPublic: {
    type: Boolean,
    defaultValue: false
  },
  coverImageUrl: {
    type: String,
    optional: true,
  },
  soundIds: {
    type: Array,
    defaultValue: []
  },
  'soundIds.$': {
    type: String, // Assuming sound IDs are strings
  },
  ownerId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      } else if (this.isUpsert) {
        return { $setOnInsert: this.userId };
      } else {
        this.unset(); // Prevent user from changing ownerId
      }
    },
    },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from changing createdAt
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

PlaylistsCollection.attachSchema(PlaylistsSchema);
