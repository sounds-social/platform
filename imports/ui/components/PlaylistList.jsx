import React from 'react';
import PlaylistCard from './PlaylistCard';

const PlaylistList = ({ playlists, loading, noPlaylistsMessage }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (playlists.length === 0) {
    return <div className="text-center py-8 text-gray-600">{noPlaylistsMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map(playlist => (
        <PlaylistCard key={playlist._id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistList;
