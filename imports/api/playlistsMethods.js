import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PlaylistsCollection } from './playlists';

Meteor.methods({
  async 'playlists.insert'(playlist) {
    check(playlist, {
      name: String,
      description: String,
      isPublic: Boolean,
      coverImageUrl: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.insertAsync({
      ...playlist,
      ownerId: this.userId,
      createdAt: new Date(),
    });
  },

  async 'playlists.update'(playlistId, playlist) {
    check(playlistId, String);
    check(playlist, {
      name: String,
      description: String,
      isPublic: Boolean,
      coverImageUrl: String,
      soundIds: [String],
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const existingPlaylist = await PlaylistsCollection.findOneAsync(playlistId);

    if (existingPlaylist.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.updateAsync(playlistId, {
      $set: {
        ...playlist,
        updatedAt: new Date(),
      },
    });
  },

  async 'playlists.remove'(playlistId) {
    check(playlistId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await PlaylistsCollection.findOneAsync(playlistId);

    if (playlist.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.removeAsync(playlistId);
  },

  async 'playlists.addSound'(playlistId, soundId) {
    check(playlistId, String);
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await PlaylistsCollection.findOneAsync(playlistId);

    if (playlist.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.updateAsync(
      { _id: playlistId, soundIds: { $ne: soundId } },
      {
        $push: {
          soundIds: {
            $each: [soundId],
            $position: 0,
          },
        },
      },
    );
  },

  async 'playlists.removeSound'(playlistId, soundId) {
    check(playlistId, String);
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await PlaylistsCollection.findOneAsync(playlistId);

    if (playlist.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.updateAsync(playlistId, {
      $pull: { soundIds: soundId },
    });
  },
});
