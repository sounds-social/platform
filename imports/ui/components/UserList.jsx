import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ users, loading, noUsersMessage = "No users found." }) => {
  if (loading) {
    return <p className="text-gray-600">Loading users...</p>;
  }

  if (!users || users.length === 0) {
    return <p className="text-gray-600">{noUsersMessage}</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map(user => (
        <Link to={`/profile/${user.profile.slug}`} key={user._id} className="block bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200">
          {user.profile.avatar ? (
            <img src={user.profile.avatar} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-xl font-bold">
              {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{user.profile.displayName}</p>
            <p className="text-sm text-gray-500">@{user.profile.slug}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserList;
