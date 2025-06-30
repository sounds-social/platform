import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiX } from 'react-icons/fi';

const AudioPlayer = ({ src, title, soundId, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (src) {
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.load();
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [src]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

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

  if (!src) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-6 flex items-center justify-between shadow-lg">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      <div className="flex items-center space-x-4 flex-grow">
        <button onClick={togglePlayPause} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600">
          {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
        </button>
        <div className="flex-grow flex items-center space-x-4">
          {title && soundId && (
            <div className="grow">
              <Link to={`/sound/${soundId}`} className="text-blue-300 hover:underline text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
                {title}
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
      <button onClick={onClose} className="ml-4 p-2 rounded-full bg-red-500 hover:bg-red-600">
        <FiX size={24} />
      </button>
    </div>
  );
};

export default AudioPlayer;
