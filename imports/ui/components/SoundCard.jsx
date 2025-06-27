import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiHeart } from 'react-icons/fi';

const SoundCard = ({ sound }) => {
  const isPrivate = sound.isPrivate && sound.userId !== Meteor.userId();

  if (isPrivate) {
    return null; // Don't display private sounds to other users
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {sound.backgroundImage ? (
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${sound.backgroundImage})` }}
        >
          <div className="absolute inset-0 flex items-end p-4">
            <div className="text-white text-shadow-lg">
              <Link to={`/sound/${sound._id}`} className="text-xl font-bold text-shadow-md">
                {sound.title}
              </Link>
              <p className="text-sm text-shadow-sm">
                <Link to={`/profile/${sound.userSlug}`} className="hover:underline">
                  {sound.userName}
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="w-1/6 aspect-square bg-gray-200 flex-shrink-0">
            {sound.coverImage && (
              <img src={sound.coverImage} alt={sound.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="w-5/6 p-4 flex flex-col justify-between">
            <div>
              <Link to={`/sound/${sound._id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-500">
                {sound.title}
              </Link>
              <p className="text-sm text-gray-600">
                <Link to={`/profile/${sound.userSlug}`} className="hover:underline">
                  {sound.userName}
                </Link>
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <FiPlay className="mr-1" /> {sound.playCount || 0}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <FiHeart className="mr-1" /> {sound.likesCount || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundCard;
