import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TinderCard from 'react-tinder-card';
import { FiSettings, FiX, FiHeart } from 'react-icons/fi';
import { Matches } from '../../api/matches';
import { Link } from 'react-router-dom';

const CollabFinder = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [mood, setMood] = useState('');
  const [matchDescription, setMatchDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  const { users, currentUser } = useTracker(() => {
    Meteor.subscribe('users.all');
    Meteor.subscribe('matches.own');
    Meteor.subscribe('matches.matched');
    const allUsers = Meteor.users.find({ _id: { $ne: Meteor.userId() }, 'profile.firstName': { $exists: true, $ne: null, $ne: '' } }).fetch();
    const currentUser = Meteor.user();

    const swipedUserIds = Matches.find({ userId: currentUser?._id }).map(m => m.swipedUserId);
    const matchedUserIds = Matches.find({ matched: true, $or: [{ userId: currentUser?._id }, { swipedUserId: currentUser?._id }] }).map(m => m.userId === currentUser?._id ? m.swipedUserId : m.userId);

    return {
      users: allUsers.filter(u => !swipedUserIds.includes(u._id) && !matchedUserIds.includes(u._id)),
      currentUser,
    };
  });

  const openSettings = () => {
    if (currentUser) {
      setFirstName(currentUser.profile.firstName || '');
      setMood(currentUser.profile.mood || '');
      setMatchDescription(currentUser.profile.matchDescription || '');
      setTags(currentUser.profile.tags || []);
    }
    setShowSettings(true);
  };

  const onSwipe = (direction, swipedUserId) => {
    Meteor.callAsync('matches.swipe', { swipedUserId, direction })
      .then(res => {
        if (res?.matched) {
          const user = Meteor.users.findOne(swipedUserId);
          setMatchedUser(user);
          setShowMatchModal(true);
        }
      });
  };

  const setupProfile = () => {
    setShowIntro(false);
    openSettings();
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    Meteor.callAsync('users.updateCollabProfile', firstName, mood, matchDescription, tags)
      .then(() => setShowSettings(false))
      .catch(err => console.error(err));
  };

  const isProfileComplete = currentUser?.profile.firstName && currentUser?.profile.mood;
  const isLoggedIn = !!Meteor.userId();

  if (showIntro && !isProfileComplete) {
    return (
      <div className="text-center my-20 p-8 rounded-lg">
        <h1 className="text-6xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 mb-4 animate-pulse-slow">Collab Finder</h1>
        <p className="mb-8 font-medium text-xl text-purple-950">Swipe left or right on potential music collaborators</p>
        {isLoggedIn ? (
          <button onClick={setupProfile} className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out transform hover:scale-105">Setup Profile</button>
        ) : (
          <Link to="/sign-up" className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out transform hover:scale-105">Sign Up</Link>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-slate-300 rounded-2xl overflow-x-hidden">
      <div className="absolute top-4 right-4 flex space-x-4">
        <Link to="/match-history" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
          Match History
        </Link>
        <button onClick={openSettings} className="text-gray-600 hover:text-pink-500">
          <FiSettings size={24} />
        </button>
      </div>
      <div className="w-full max-w-md h-3/4 flex items-center justify-center">
        {users.length > 0 ? (
          users.map((user) => (
            <TinderCard
              key={user._id}
              onSwipe={(dir) => onSwipe(dir, user._id)}
              preventSwipe={['up', 'down']}
              swipeThreshold={0.8}
              className="absolute"
            >
              <div className="relative w-[300px] h-[400px] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 flex flex-col items-center justify-center text-center">
                {user.profile.avatar ? (
                  <img src={user.profile.avatar} alt={user.profile.displayName} className="w-32 h-32 rounded-full mb-4 border border-gray-300" />
                ) : (
                  <div className="w-32 h-32 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-5xl font-bold">
                    {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
                  </div>
                )}
                
                {user.profile.firstName && <p className="text-lg text-gray-800 font-bold">{user.profile.firstName}</p>}
                {user.profile.mood && <p className="text-lg text-purple-500">{user.profile.mood}</p>}
                {user.profile.matchDescription && <p className="mt-4 text-gray-800">{user.profile.matchDescription}</p>}
                <div className="mt-4 flex flex-wrap justify-center">
                  {user.profile.tags && user.profile.tags.map(tag => (
                    <span key={tag} className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm m-1">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-[-60px] left-0 right-0 flex justify-center space-x-10">
                <button onClick={() => onSwipe('left', user._id)} className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200">
                  <FiX size={24} />
                </button>
                <button onClick={() => onSwipe('right', user._id)} className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200">
                  <FiHeart size={24} />
                </button>
              </div>
            </TinderCard>
          ))
        ) : (
          <p className="text-gray-600">No users found.</p>
        )}
      </div>
      {showSettings && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{isProfileComplete ? 'Edit Profile' : 'Add Profile'}</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-800 mb-2">First Name</label>
                <input type="text" id="firstName" value={firstName} maxLength={35} onChange={e => setFirstName(e.target.value)} className="w-full p-2 rounded bg-gray-200 text-gray-800" required />
              </div>
              <div className="mb-4">
                <label htmlFor="mood" className="block text-gray-800 mb-2">Mood</label>
                <select id="mood" value={mood} onChange={e => setMood(e.target.value)} className="w-full p-2 rounded bg-gray-200 text-gray-800" required>
                  <option value="">Select a mood</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="dreamy">Dreamy</option>
                  <option value="epic">Epic</option>
                  <option value="relaxing">Relaxing</option>
                  <option value="scary">Scary</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="matchDescription" className="block text-gray-800 mb-2">What are you looking for?</label>
                <textarea id="matchDescription" value={matchDescription} onChange={e => setMatchDescription(e.target.value)} maxLength={100} className="w-full p-2 rounded bg-gray-200 text-gray-800"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-800 mb-2">Genres / Tags (comma separated)</label>
                <input type="text" id="tags" value={tags.join(', ')} onChange={e => setTags(e.target.value.split(', ').map(t => t.trim()))} maxLength={42} className="w-full p-2 rounded bg-gray-200 text-gray-800" />
              </div>
              <div className="flex justify-end">
                {isProfileComplete && (
                  <button type="button" onClick={() => setShowSettings(false)} className="cursor-pointer bg-gray-500 text-white px-6 py-3 rounded-lg font-bold mt-4 mr-2">Close</button>
                )}
                <button type="submit" className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg font-bold mt-4">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMatchModal && matchedUser && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Congrats!</h2>
            <p className="text-lg text-gray-800 mb-6">You've matched with {matchedUser.profile.firstName}!</p>
            <div className="flex justify-center space-x-4">
              <Link to={`/messages/${matchedUser._id}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg font-bold">Send a DM</Link>
              <button onClick={() => setShowMatchModal(false)} className="cursor-pointer bg-gray-500 text-white px-6 py-3 rounded-lg font-bold">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollabFinder;
