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

  const { playlist, sounds, loading, playlistOwner } = useTracker(() => {
    const noDataAvailable = { playlist: null, sounds: [], loading: true, playlistOwner: null };
    const soundsHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');

    let playlistData = null;
    let soundIds = [];
    let ownerId = null;

    if (isLikesPlaylist) {
      const user = Meteor.user();
      if (!user) return noDataAvailable;
      playlistData = { _id: 'likes', name: 'Liked Sounds', isPublic: false, sounds: user.profile?.likes || [] };
      soundIds = user.profile?.likes || [];
      ownerId = user._id;
    } else {
      const playlistHandle = Meteor.subscribe('playlists.singlePlaylist', playlistId);
      if (!playlistHandle.ready()) return noDataAvailable;
      playlistData = Playlists.findOne(playlistId);
      if (playlistData) {
        soundIds = playlistData.sounds || [];
        ownerId = playlistData.ownerId;
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

    const owner = ownerId ? Meteor.users.findOne(ownerId) : null;

    return { playlist: playlistData, sounds: soundsWithUserData, loading: !ready, playlistOwner: owner };
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
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 mr-4">{playlist.name}</h1>
          {!isLikesPlaylist && (
            <span className={`text-white text-sm px-3 py-1 rounded-full ${playlist.isPublic ? 'bg-blue-500' : 'bg-red-500'}`}>
              {playlist.isPublic ? 'Public' : 'Private'}
            </span>
          )}
        </div>
        {!isLikesPlaylist && playlistOwner && (
          <p className="text-lg text-gray-600 mt-2">
            by <Link to={`/profile/${playlistOwner.profile.slug}`} className="text-blue-500 hover:underline">{playlistOwner.profile.displayName}</Link>
          </p>
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
