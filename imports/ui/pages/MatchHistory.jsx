import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Matches } from '../../api/matches';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const MatchHistory = () => {
  const { matchedUsers, loading } = useTracker(() => {
    const noDataAvailable = { matchedUsers: [], loading: true };
    const matchesHandle = Meteor.subscribe('matches.matched');
    const usersHandle = Meteor.subscribe('users.all'); // Subscribe to all users to get profile info

    if (!matchesHandle.ready() || !usersHandle.ready()) {
      return noDataAvailable;
    }

    const currentUserId = Meteor.userId();
    const matchedDocs = Matches.find({
      $or: [
        { userId: currentUserId, matched: true },
        { swipedUserId: currentUserId, matched: true },
      ],
    }).fetch();

    const matchedUsersWithDate = matchedDocs.map(doc => {
      const otherUserId = doc.userId === currentUserId ? doc.swipedUserId : doc.userId;
      const user = Meteor.users.findOne(otherUserId);
      return {
        ...user,
        matchedAt: doc.updatedAt // Use updatedAt from the match document
      };
    });

    return {
      matchedUsers: matchedUsersWithDate,
      loading: false,
    };
  });

  if (loading) {
    return <div className="text-center py-8">Loading match history...</div>;
  }

  if (matchedUsers.length === 0) {
    return <div className="text-center py-8 text-gray-600">No matches yet. Keep swiping!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Match History</h1>
      <div className="grid grid-cols-1 gap-4">
        {matchedUsers.map(user => (
          <Link to={`/profile/${user.profile.slug}`} key={user._id} className="block w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              {user.profile.avatar ? (
                <img src={user.profile.avatar} alt={user.profile.displayName} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-2xl font-bold">
                  {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{user.profile.displayName}</h2>
                {user.profile.firstName && <p className="text-gray-600">{user.profile.firstName}</p>}
                {user.profile.mood && <p className="text-gray-600 font-semibold">{user.profile.mood}</p>}
                {user.matchedAt && <p className="text-sm text-gray-500">Matched {formatDistanceToNow(user.matchedAt, { addSuffix: true })}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
