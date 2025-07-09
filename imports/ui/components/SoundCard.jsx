import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPlay, FiHeart } from 'react-icons/fi';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { formatDistanceToNow } from 'date-fns';

const SoundCard = ({ sound, sounds, index }) => {
  const isPrivate = sound.isPrivate && sound.userId !== Meteor.userId();
  const history = useHistory();
  const { playPlaylist, playSingleSound } = useAudioPlayer();

  if (isPrivate) {
    return null; // Don't display private sounds to other users
  }

  const handleUserClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    history.push(`/profile/${sound.userSlug}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (sounds.length === 1) {
      playSingleSound({ src: sound.audioFile, title: sound.title, id: sound._id });
    } else {
      playPlaylist(sounds.map(s => ({ src: s.audioFile, title: s.title, id: s._id })), index);
    }
  };

  return (
    <Link to={`/sound/${sound._id}`} className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {sound.backgroundImage ? (
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${sound.backgroundImage})` }}
        >
          <div className="absolute inset-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-between p-4">
            <div className="flex justify-end space-x-4 text-white text-shadow-lg">
              <div className="flex items-center text-sm">
                <FiPlay className="mr-1" /> {sound.playCount || 0}
              </div>
              <div className="flex items-center text-sm">
                <FiHeart className="mr-1" /> {sound.likes ? sound.likes.length : 0}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-white text-shadow-lg">
                <h3 className="text-xl font-bold text-shadow-md">
                  {sound.title}
                  {sound.isPrivate && (
                    <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">Private</span>
                  )}
                </h3>
                <p className="text-sm text-shadow-sm">
                  <span onClick={handleUserClick} className="hover:underline cursor-pointer">
                    {sound.userName}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-200 hidden md:block">
                {formatDistanceToNow(new Date(sound.createdAt))} ago
              </p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="bg-blue-500 text-white rounded-full p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110 cursor-pointer"
            >
              <FiPlay size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-48">
          <div className="relative h-full aspect-square bg-gray-200 flex-shrink-0">
            {sound.coverImage && (
              <img src={sound.coverImage} alt={sound.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="bg-blue-500 text-white rounded-full p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110 cursor-pointer"
              >
                <FiPlay size={24} />
              </button>
            </div>
          </div>
          <div className="flex-grow p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {sound.title}
                    {sound.isPrivate && (
                      <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">Private</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span onClick={handleUserClick} className="hover:underline cursor-pointer">
                      {sound.userName}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-4 hidden md:block">
                  {formatDistanceToNow(new Date(sound.createdAt))} ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <FiPlay className="mr-1" /> {sound.playCount || 0}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <FiHeart className="mr-1" /> {sound.likes ? sound.likes.length : 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default SoundCard;
