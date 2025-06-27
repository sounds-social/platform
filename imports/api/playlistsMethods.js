import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Playlists } from './playlists';

Meteor.methods({
  async 'playlists.insert'(name, isPublic) {
    check(name, String);
    check(isPublic, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return await Playlists.insertAsync({
      name,
      isPublic,
      userId: this.userId,
    });
  },

  async 'playlists.update'(playlistId, name, isPublic) {
    check(playlistId, String);
    check(name, String);
    check(isPublic, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await Playlists.findOneAsync({ _id: playlistId, userId: this.userId });
    if (!playlist) {
      throw new Meteor.Error('access-denied');
    }

    return await Playlists.updateAsync(playlistId, {
      $set: {
        name,
        isPublic,
      },
    });
  },

  async 'playlists.remove'(playlistId) {
    check(playlistId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await Playlists.findOneAsync({ _id: playlistId, userId: this.userId });
    if (!playlist) {
      throw new Meteor.Error('access-denied');
    }

    return await Playlists.removeAsync(playlistId);
  },

  async 'playlists.addSound'(playlistId, soundId) {
    check(playlistId, String);
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await Playlists.findOneAsync({ _id: playlistId, userId: this.userId });
    if (!playlist) {
      throw new Meteor.Error('access-denied');
    }

    return await Playlists.updateAsync(playlistId, {
      $addToSet: { sounds: soundId },
    });
  },

  async 'playlists.removeSound'(playlistId, soundId) {
    check(playlistId, String);
    check(soundId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await Playlists.findOneAsync({ _id: playlistId, userId: this.userId });
    if (!playlist) {
      throw new Meteor.Error('access-denied');
    }

    return await Playlists.updateAsync(playlistId, {
      $pull: { sounds: soundId },
    });
  },

  async 'playlists.reorderSounds'(playlistId, soundIds) {
    check(playlistId, String);
    check(soundIds, Array);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const playlist = await Playlists.findOneAsync({ _id: playlistId, userId: this.userId });
    if (!playlist) {
      throw new Meteor.Error('access-denied');
    }

    return await Playlists.updateAsync(playlistId, {
      $set: { sounds: soundIds },
    });
  },
});
