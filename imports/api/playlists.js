import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Playlists = new Mongo.Collection('playlists');

const PlaylistsSchema = new SimpleSchema({
  name: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    defaultValue: false,
  },
  sounds: {
    type: Array,
    defaultValue: [],
  },
  'sounds.$': {
    type: String,
  },
  userId: {
    type: String,
  },
});

Playlists.attachSchema(PlaylistsSchema);
