import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiX, FiSkipForward, FiSkipBack, FiRepeat } from 'react-icons/fi';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const AudioPlayer = () => {
  const { currentSound, isPlaying, audioRef, handleNext, handlePrevious, togglePlayPause, setCurrentSound, isLooping, toggleLoop, playlist, playlistIndex } = useAudioPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSound) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center space-x-4 flex-grow">
        <button
          onClick={handlePrevious}
          className={`p-2 rounded-full ${playlist.length <= 1 || (!isLooping && playlistIndex === 0) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
          disabled={playlist.length <= 1 || (!isLooping && playlistIndex === 0)}
        >
          <FiSkipBack size={24} />
        </button>
        <button onClick={togglePlayPause} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
          {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
        </button>
        <button
          onClick={handleNext}
          className={`p-2 rounded-full ${playlist.length <= 1 || (!isLooping && playlistIndex === playlist.length - 1) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
          disabled={playlist.length <= 1 || (!isLooping && playlistIndex === playlist.length - 1)}
        >
          <FiSkipForward size={24} />
        </button>
        <div className="flex-grow flex items-center space-x-4">
          {currentSound.title && currentSound.id && (
            <div className="grow">
              <Link to={`/sound/${currentSound.id}`} className="text-blue-300 hover:underline text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                {currentSound.title}
              </Link>
            </div>
          )}
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <button
        onClick={toggleLoop}
        className={`ml-4 p-2 rounded-full ${isLooping ? 'bg-blue-500' : 'bg-gray-500'} cursor-pointer`}
      >
        <FiRepeat size={24} />
      </button>
      <button onClick={() => setCurrentSound(null)} className="ml-4 p-2 rounded-full bg-red-500 hover:bg-red-600">
        <FiX size={24} />
      </button>
    </div>
  );
};

export default AudioPlayer;
