import React from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PlaylistsCollection } from '../../api/playlists';
import { Sounds } from '../../api/sounds'; // Assuming Sounds is the correct collection name
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import SoundList from '../components/SoundList';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const history = useHistory();

  const { playlist, sounds, isLoading } = useTracker(() => {
    const playlistHandle = Meteor.subscribe('playlists.singlePlaylist', playlistId);
    const playlistData = PlaylistsCollection.findOne({ _id: playlistId });
    const soundsHandle = playlistData ? Meteor.subscribe('sounds.byIds', playlistData.soundIds) : { ready: () => true };

    const loading = !playlistHandle.ready() || !soundsHandle.ready();
    const soundData = playlistData ? Sounds.find({ _id: { $in: playlistData.soundIds } }, { sort: { createdAt: -1 } }).fetch() : [];

    return { playlist: playlistData, sounds: soundData, isLoading: loading };
  });

  const handleRemovePlaylist = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await Meteor.callAsync('playlists.remove', playlistId);
        history.push('/profile'); // Redirect to profile page after deletion
      } catch (error) {
        alert(error.reason || 'Failed to delete playlist.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="text-center py-8 text-gray-600">Playlist not found.</div>;
  }

  const isOwner = Meteor.userId() === playlist.ownerId;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start">
        {playlist.coverImageUrl ? (
          <img
            src={playlist.coverImageUrl}
            alt={playlist.name}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8"
          />
        ) : (
          <div className="w-full md:w-64 h-64 rounded-lg mb-4 md:mb-0 md:mr-8 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-5xl font-bold">
            {playlist.name ? playlist.name.charAt(0).toUpperCase() : ''}
          </div>
        )}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{playlist.name}</h1>
          <p className="text-lg text-gray-600 mb-4">
            {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
          </p>
          {isOwner && (
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <Link
                to={`/playlist/${playlistId}/edit`}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                <FiEdit className="mr-2" /> Edit Playlist
              </Link>
              <button
                onClick={handleRemovePlaylist}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                <FiTrash2 className="mr-2" /> Delete Playlist
              </button>
            </div>
          )}
        </div>
      </div>

      <SoundList sounds={sounds} loading={isLoading} noSoundsMessage="No sounds in this playlist yet." />
    </div>
  );
};

export default PlaylistDetailPage;
