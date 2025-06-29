import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';
import Fuse from 'fuse.js';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchType, setSearchType] = useState('sounds'); // 'sounds' or 'users'

  const { sounds, users, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], users: [], loading: true };
    const soundsHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');

    if (!soundsHandle.ready() || !usersHandle.ready()) return noDataAvailable;

    const allSounds = Sounds.find({}).fetch();
    const allUsers = Meteor.users.find({}).fetch();

    const fuseSounds = new Fuse(allSounds, {
      keys: ['title', 'description', 'tags'],
      threshold: 0.3, // Adjust for fuzziness
    });

    const fuseUsers = new Fuse(allUsers, {
      keys: ['profile.displayName'],
      threshold: 0.3,
    });

    const filteredSounds = searchQuery ? fuseSounds.search(searchQuery).map(result => result.item) : [];
    const filteredUsers = searchQuery ? fuseUsers.search(searchQuery).map(result => result.item) : [];

    const soundsWithUserData = filteredSounds.map(sound => {
      const soundUser = Meteor.users.findOne({ _id: sound.userId }, { fields: { 'profile.displayName': 1, 'profile.slug': 1 } });
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    return { sounds: soundsWithUserData, users: filteredUsers, loading: false };
  }, [searchQuery]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="py-8">
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
      </div>

      {searchType === 'sounds' && (
        <SoundList sounds={sounds} loading={loading} noSoundsMessage="No sounds found matching your search." />
      )}

      {searchType === 'users' && (
        <div>
          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <Link to={`/profile/${user.profile.slug}`} key={user._id} className="block bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200">
                  {user.profile.avatar ? (
                    <img src={user.profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xl font-bold">
                      {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                  <p className="text-lg font-semibold text-gray-800">{user.profile.displayName}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">No users found matching your search.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
