import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistList = ({ playlists }) => {
  if (!playlists || playlists.length === 0) {
    return <p className="text-gray-600 text-center py-4">No playlists found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {playlists.map(playlist => (
        <div key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <Link to={`/playlist/${playlist._id}`}>
            {playlist.coverImageUrl ? (
              <img src={playlist.coverImageUrl} alt={playlist.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                No Cover Image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-600">{playlist.isPublic ? 'Public' : 'Private'}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;