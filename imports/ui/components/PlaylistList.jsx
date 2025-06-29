import React from 'react';
import PlaylistCard from './PlaylistCard';

const PlaylistList = ({ playlists, loading, noPlaylistsMessage }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (playlists.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{noPlaylistsMessage}</span>
      </div>
    );
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
