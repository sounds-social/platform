import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PlaylistsCollection } from './playlists';

Meteor.publish('playlists.myPlaylists', function publishMyPlaylists() {
  if (!this.userId) {
    return this.ready();
  }
  return PlaylistsCollection.find({ ownerId: this.userId });
});

Meteor.publish('playlists.publicPlaylists', function publishPublicPlaylists() {
  return PlaylistsCollection.find({ isPublic: true });
});

Meteor.publish('playlists.singlePlaylist', function publishSinglePlaylist(playlistId) {
  check(playlistId, String);
  return PlaylistsCollection.find({ _id: playlistId });
});

Meteor.publish('playlists.publicPlaylistsForUser', function publishPublicPlaylistsForUser(userId) {
  check(userId, String);
  return PlaylistsCollection.find({ ownerId: userId, isPublic: true });
});
