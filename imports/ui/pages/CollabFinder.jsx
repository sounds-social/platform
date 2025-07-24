import React, { useState, useMemo, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TinderCard from 'react-tinder-card';
import { FiSettings } from 'react-icons/fi';
import { Matches } from '../../api/matches';

const CollabFinder = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { users, currentUser } = useTracker(() => {
    Meteor.subscribe('users.all');
    Meteor.subscribe('matches.own');
    const allUsers = Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
    const currentUser = Meteor.user();

    const swipedUserIds = Matches.find({ userId: currentUser._id }).map(m => m.swipedUserId);

    return {
      users: allUsers.filter(u => !swipedUserIds.includes(u._id)),
      currentUser,
    };
  });

  const onSwipe = (direction, swipedUserId) => {
    Meteor.callAsync('matches.swipe', { swipedUserId, action: direction });
  };

  const setupProfile = () => {
    setShowIntro(false);
    setShowSettings(true);
  };

  if (showIntro && (!currentUser.profile.firstName || !currentUser.profile.mood)) {
    return (
      <div className="text-center my-20 p-8 rounded-lg">
        <h1 className="text-6xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 mb-4 animate-pulse-slow">Collab Finder</h1>
        <p className="mb-8 font-medium text-xl text-purple-950">Swipe left or right on potential music collaborators</p>
        <button onClick={setupProfile} className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out transform hover:scale-105">Setup Profile</button>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowSettings(true)} className="text-white hover:text-pink-500">
          <FiSettings size={24} />
        </button>
      </div>
      <div className="w-full max-w-md h-3/4 flex items-center justify-center">
        {users.map((user) => (
          <TinderCard
            key={user._id}
            onSwipe={(dir) => onSwipe(dir, user._id)}
            preventSwipe={['up', 'down']}
            className="absolute"
          >
            <div className="relative w-full h-full rounded-lg shadow-neon-purple bg-gray-800 p-6 flex flex-col items-center justify-center text-center text-white">
              {user.profile.avatar ? (
                <img src={user.profile.avatar} alt={user.profile.displayName} className="w-32 h-32 rounded-full mb-4 shadow-lg shadow-purple-500/50" />
              ) : (
                <div className="w-32 h-32 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-5xl font-bold">
                  {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
                </div>
              )}
              <h2 className="text-2xl font-bold text-pink-400 text-shadow-neon">{user.profile.displayName}</h2>
              <p className="text-lg text-purple-300">{user.profile.mood}</p>
              <p className="mt-4">{user.profile.matchDescription}</p>
              <div className="mt-4 flex flex-wrap justify-center">
                {user.profile.tags && user.profile.tags.map(tag => (
                  <span key={tag} className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm m-1">{tag}</span>
                ))}
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      {showSettings && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-neon-blue">
            <h2 className="text-2xl font-bold mb-4 text-white">Edit Profile</h2>
            {/* Add form here */}
            <button onClick={() => setShowSettings(false)} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollabFinder;