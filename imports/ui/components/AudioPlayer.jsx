import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiX, FiSkipForward, FiSkipBack, FiRepeat, FiShare } from 'react-icons/fi';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const AudioPlayer = () => {
  const { currentSound, isPlaying, audioRef, handleNext, handlePrevious, togglePlayPause, setCurrentSound, isLooping, toggleLoop, playlist, playlistIndex, duration } = useAudioPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [audioRef.current]);

  const handleSeek = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  };

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/sound/${currentSound.id}?t=${Math.floor(currentTime)}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000); // Hide message after 2 seconds
    });
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0 || !isFinite(time)) {
      return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSound) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 sm:p-3 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-grow">
        <button
          onClick={handlePrevious}
          className={`p-1 sm:p-2 rounded-full ${playlist.length <= 1 || (!isLooping && playlistIndex === 0) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
          disabled={playlist.length <= 1 || (!isLooping && playlistIndex === 0)}
        >
          <FiSkipBack size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button onClick={togglePlayPause} className="p-1 sm:p-2 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
          {isPlaying ? <FiPause size={20} className="sm:w-6 sm:h-6" /> : <FiPlay size={20} className="sm:w-6 sm:h-6" />}
        </button>
        <button
          onClick={handleNext}
          className={`p-1 sm:p-2 rounded-full ${playlist.length <= 1 || (!isLooping && playlistIndex === playlist.length - 1) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
          disabled={playlist.length <= 1 || (!isLooping && playlistIndex === playlist.length - 1)}
        >
          <FiSkipForward size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="flex-grow flex items-center space-x-2 sm:space-x-4">
          {currentSound.title && currentSound.id && !currentSound.hideTitle && (
            <div className="grow hidden sm:block">
              <Link to={`/sound/${currentSound.id}`} className="text-blue-300 hover:underline text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                {currentSound.title}
              </Link>
            </div>
          )}
          <span className="text-xs sm:text-base">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs sm:text-base">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="relative">
        <button
          onClick={handleShare}
          className="ml-2 sm:ml-4 p-1 sm:p-2 rounded-full bg-gray-500 hover:bg-blue-600 cursor-pointer"
        >
          <FiShare size={20} className="sm:w-6 sm:h-6" />
        </button>
        {showCopiedMessage && (
          <div className="absolute bottom-full mb-2 right-0 bg-black text-white text-xs rounded py-1 px-2">
            Link copied!
          </div>
        )}
      </div>
      <button
        onClick={toggleLoop}
        className={`ml-2 sm:ml-4 p-1 sm:p-2 rounded-full ${isLooping ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600 cursor-pointer`}
      >
        <FiRepeat size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button onClick={() => setCurrentSound(null)} className="ml-2 sm:ml-4 p-1 sm:p-2 rounded-full bg-red-500 hover:bg-red-600">
        <FiX size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default AudioPlayer;
