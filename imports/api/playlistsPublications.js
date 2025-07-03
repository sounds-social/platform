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

Meteor.publish('playlists.allPublicPlaylists', function publishAllPublicPlaylists() {
  return PlaylistsCollection.find({ isPublic: true });
});

Meteor.publish('playlists.singlePlaylist', async function publishSinglePlaylist(playlistId) {
  check(playlistId, String);
  const playlist = await PlaylistsCollection.findOneAsync({ _id: playlistId });

  if (!playlist) {
    return this.ready();
  }

  // If the playlist is public, or if the current user is the owner, publish it
  if (playlist.isPublic || this.userId === playlist.ownerId) {
    return PlaylistsCollection.find({ _id: playlistId });
  } else {
    // If it's private and not owned by the current user, don't publish
    return this.ready();
  }
});

Meteor.publish('playlists.publicPlaylistsForUser', function publishPublicPlaylistsForUser(userId) {
  check(userId, String);
  return PlaylistsCollection.find({ ownerId: userId, isPublic: true });
});
