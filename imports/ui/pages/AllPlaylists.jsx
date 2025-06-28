import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PlaylistsCollection } from '../../api/playlists';
import PlaylistList from '../components/PlaylistList';

const AllPlaylists = () => {
  const { slug } = useParams();

  const { playlists, loading } = useTracker(() => {
    let playlistsHandle;
    let userId;

    if (slug) {
      // Get user ID from slug
      const user = Meteor.users.findOne({ 'profile.slug': slug });
      userId = user ? user._id : null;
      playlistsHandle = Meteor.subscribe('playlists.publicPlaylistsForUser', userId);
    } else {
      // Current user's playlists
      userId = Meteor.userId();
      playlistsHandle = Meteor.subscribe('playlists.myPlaylists');
    }

    const loading = !playlistsHandle.ready();
    const fetchedPlaylists = PlaylistsCollection.find({ ownerId: userId }, { sort: { createdAt: -1 } }).fetch();

    return { playlists: fetchedPlaylists, loading };
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading playlists...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Playlists</h1>
      <PlaylistList playlists={playlists} />
    </div>
  );
};

export default AllPlaylists;