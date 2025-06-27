import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Playlists } from '../../api/playlists';
import { Sounds } from '../../api/sounds';
import SoundCard from '../components/SoundCard';

const Playlist = () => {
  const { playlistId } = useParams();
  const isLikesPlaylist = playlistId === 'likes';

  const { playlist, sounds, loading } = useTracker(() => {
    const noDataAvailable = { playlist: null, sounds: [], loading: true };
    const soundsHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');

    let playlistData = null;
    let soundIds = [];

    if (isLikesPlaylist) {
      const user = Meteor.user();
      if (!user) return noDataAvailable;
      playlistData = { _id: 'likes', name: 'Liked Sounds', isPublic: false, sounds: user.profile?.likes || [] };
      soundIds = user.profile?.likes || [];
    } else {
      const playlistHandle = Meteor.subscribe('playlists.own');
      if (!playlistHandle.ready()) return noDataAvailable;
      playlistData = Playlists.findOne(playlistId);
      if (playlistData) {
        soundIds = playlistData.sounds || [];
      }
    }

    const ready = soundsHandle.ready() && usersHandle.ready();
    const fetchedSounds = Sounds.find({ _id: { $in: soundIds } }).fetch();

    const soundsWithUserData = fetchedSounds.map(sound => {
      const soundUser = Meteor.users.findOne(sound.userId);
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    return { playlist: playlistData, sounds: soundsWithUserData, loading: !ready };
  }, [playlistId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!playlist) {
    return <div className="text-center py-8 text-gray-600">Playlist not found</div>;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{playlist.name}</h1>
        {!isLikesPlaylist && (
          <p className="text-gray-600 text-lg mt-2">{playlist.isPublic ? 'Public' : 'Private'} Playlist</p>
        )}
        <p className="text-gray-500 text-sm mt-2">{playlist.sounds?.length || 0} tracks</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tracks</h2>
      {sounds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sounds.map(sound => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No sounds in this playlist yet.</p>
      )}
    </div>
  );
};

export default Playlist;