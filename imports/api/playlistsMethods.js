import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PlaylistsCollection } from './playlists';

Meteor.methods({
  async 'playlists.insert'(name, isPublic, coverImageUrl) {
    check(name, String);
    check(isPublic, Boolean);
    check(coverImageUrl, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.insertAsync({
      name,
      isPublic,
      coverImageUrl,
      ownerId: this.userId,
      createdAt: new Date(),
    });
  },

  async 'playlists.update'(playlistId, name, isPublic, coverImageUrl, soundIds) {
    check(playlistId, String);
    check(name, String);
    check(isPublic, Boolean);
    check(coverImageUrl, String);
    check(soundIds, Array);
    check(soundIds.every(id => typeof id === 'string'), true);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await PlaylistsCollection.findOneAsync(playlistId);

    if (playlist.ownerId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await PlaylistsCollection.updateAsync(playlistId, {
      $set: {
        name,
        isPublic,
        coverImageUrl,
        soundIds,
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
