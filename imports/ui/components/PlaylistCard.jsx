import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist._id}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-square">
        {playlist.coverImageUrl ? (
          <img src={playlist.coverImageUrl} alt={playlist.name} className="object-cover w-full h-full rounded-t-lg" />
        ) : (
          <div className="w-full h-full rounded-t-lg flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white">
            <h3 className="text-2xl font-bold">{playlist.name}</h3>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{playlist.name}</h3>
        {playlist.ownerName && (<p className="text-sm text-gray-600">
          by <Link to={`/profile/${playlist.ownerSlug}`} className="text-blue-500 hover:underline">{playlist.ownerName}</Link>
        </p>)}
        
        <p className="text-sm text-gray-600">{playlist.soundIds?.length} {playlist.soundIds?.length === 1 ? 'sound' : 'sounds'}</p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
