import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { PlaylistsCollection as Playlists } from '../../api/playlists';
import SoundList from '../components/SoundList';
import PlaylistList from '../components/PlaylistList';
import UserList from '../components/UserList';
import Fuse from 'fuse.js';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchType, setSearchType] = useState('sounds'); // 'sounds' or 'users'

  const { sounds, users, playlists, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], users: [], playlists: [], loading: true };
    const soundsHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');
    const playlistsHandle = Meteor.subscribe('playlists.allPublicPlaylists');

    if (!soundsHandle.ready() || !usersHandle.ready() || !playlistsHandle.ready()) return noDataAvailable;

    const allSounds = Sounds.find({}).fetch();
    const allUsers = Meteor.users.find({}).fetch();
    const allPlaylists = Playlists.find({ isPublic: true }).fetch();

    const fuseSounds = new Fuse(allSounds, {
      keys: ['title', 'description', 'tags'],
      threshold: 0.3, // Adjust for fuzziness
    });

    const fuseUsers = new Fuse(allUsers, {
      keys: ['profile.displayName'],
      threshold: 0.3,
    });

    const fusePlaylists = new Fuse(allPlaylists, {
      keys: ['name'],
      threshold: 0.3,
    });

    const filteredSounds = searchQuery ? fuseSounds.search(searchQuery).map(result => result.item) : [];
    const filteredUsers = searchQuery ? fuseUsers.search(searchQuery).map(result => result.item) : [];
    const filteredPlaylists = searchQuery ? fusePlaylists.search(searchQuery).map(result => result.item) : [];

    const playlistsWithUserData = filteredPlaylists.map(playlist => {
      const playlistUser = Meteor.users.findOne({ _id: playlist.ownerId }, { fields: { 'profile.displayName': 1, 'profile.slug': 1 } });
      return {
        ...playlist,
        ownerName: playlistUser ? playlistUser.profile.displayName : 'Unknown',
        ownerSlug: playlistUser ? playlistUser.profile.slug : 'unknown',
      };
    });

    const soundsWithUserData = filteredSounds.map(sound => {
      const soundUser = Meteor.users.findOne({ _id: sound.userId }, { fields: { 'profile.displayName': 1, 'profile.slug': 1 } });
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    return { sounds: soundsWithUserData, users: filteredUsers, playlists: playlistsWithUserData, loading: false };
  }, [searchQuery]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>Search Results for "{searchQuery}" - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Results for "{searchQuery}"</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSearchType('sounds')}
          className={`px-4 py-2 rounded-md font-semibold ${
            searchType === 'sounds' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Sounds
        </button>
        <button
          onClick={() => setSearchType('users')}
          className={`px-4 py-2 rounded-md font-semibold ${
            searchType === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setSearchType('playlists')}
          className={`px-4 py-2 rounded-md font-semibold ${
            searchType === 'playlists' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Playlists
        </button>
      </div>

      {searchType === 'sounds' && (
        <SoundList sounds={sounds} loading={loading} noSoundsMessage="No sounds found matching your search." />
      )}

      {searchType === 'users' && (
        <UserList users={users} loading={loading} noUsersMessage="No users found matching your search." />
      )}

      {searchType === 'playlists' && (
        <PlaylistList playlists={playlists} loading={loading} noPlaylistsMessage="No playlists found matching your search." />
      )}
    </div>
  );
};

export default SearchResults;
