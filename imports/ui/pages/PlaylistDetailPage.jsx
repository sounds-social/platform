import React from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PlaylistsCollection } from '../../api/playlists';
import { Sounds } from '../../api/sounds'; // Assuming Sounds is the correct collection name
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const history = useHistory();

  const { playlist, sounds, isLoading } = useTracker(() => {
    const playlistHandle = Meteor.subscribe('playlists.singlePlaylist', playlistId);
    const soundsHandle = Meteor.subscribe('sounds.all'); // Assuming a publication for all sounds

    const loading = !playlistHandle.ready() || !soundsHandle.ready();

    const playlistData = PlaylistsCollection.findOne({ _id: playlistId });
    const soundData = playlistData ? Sounds.find({ _id: { $in: playlistData.soundIds } }).fetch() : [];

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
        {playlist.coverImageUrl && (
          <img
            src={playlist.coverImageUrl}
            alt={playlist.name}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8"
          />
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sounds in this Playlist:</h2>
        {sounds.length > 0 ? (
          <ul className="space-y-3">
            {sounds.map(sound => (
              <li key={sound._id} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
                <Link to={`/sound/${sound._id}`} className="text-blue-600 hover:underline font-medium">
                  {sound.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No sounds in this playlist yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;