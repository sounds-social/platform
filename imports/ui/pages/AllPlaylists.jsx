import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PlaylistsCollection as Playlists } from '../../api/playlists';
import PlaylistList from '../components/PlaylistList';

const AllPlaylists = () => {
  const { slug } = useParams();

  const { playlists, loading, user } = useTracker(() => {
    const noDataAvailable = { playlists: [], loading: true, user: null };

    const userHandle = Meteor.subscribe('users.view', slug);
    if (!userHandle.ready()) return noDataAvailable;

    const currentUser = Meteor.users.findOne({ 'profile.slug': slug });
    if (!currentUser) return noDataAvailable;

    const isOwnProfile = Meteor.userId() === currentUser._id;

    const playlistsHandle = isOwnProfile
      ? Meteor.subscribe('playlists.myPlaylists')
      : Meteor.subscribe('playlists.publicPlaylistsForUser', currentUser._id);

    if (!playlistsHandle.ready()) return noDataAvailable;

    const query = { ownerId: currentUser._id };
    if (!isOwnProfile) {
      query.isPublic = true;
    }

    const userPlaylists = Playlists.find(query, { sort: { createdAt: -1 } }).fetch();

    return { playlists: userPlaylists, loading: false, user: currentUser };
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">User not found</div>;
  }

  return (
    <div className="py-8">
      <HeadProvider>
        <title>All Playlists by {user.profile.displayName} - Sounds Social</title>
      </HeadProvider>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        All Playlists by <Link to={`/profile/${user.profile.slug}`} className="text-blue-500 hover:underline">{user.profile.displayName}</Link>
      </h1>
      <PlaylistList playlists={playlists} loading={loading} noPlaylistsMessage="No playlists found." />
    </div>
  );
};

export default AllPlaylists;
