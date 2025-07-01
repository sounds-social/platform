import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(null); // { src, title, id }
  const [playlist, setPlaylist] = useState([]); // Array of { src, title, id }
  const [playlistIndex, setPlaylistIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playSound = useCallback((sound) => {
    setCurrentSound(sound);
    // Increment play count if it's a new sound being played
    if (sound && sound.id && Meteor.isClient) {
      Meteor.call('sounds.incrementPlayCount', sound.id);
    }
  }, []);

  const handleNext = useCallback(() => {
    setPlaylistIndex(prevIndex => {
      if (playlist.length === 0) return -1; // No playlist
      const nextIndex = (prevIndex + 1) % playlist.length;
      playSound(playlist[nextIndex]);
      return nextIndex;
    });
  }, [playlist, playSound]);

  const handlePrevious = useCallback(() => {
    setPlaylistIndex(prevIndex => {
      if (playlist.length === 0) return -1; // No playlist
      const prevIndexCalculated = (prevIndex - 1 + playlist.length) % playlist.length;
      playSound(playlist[prevIndexCalculated]);
      return prevIndexCalculated;
    });
  }, [playlist, playSound]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    audio.addEventListener('ended', handleNext);
    audio.addEventListener('play', handlePlayEvent);
    audio.addEventListener('pause', handlePauseEvent);

    return () => {
      audio.removeEventListener('ended', handleNext);
      audio.removeEventListener('play', handlePlayEvent);
      audio.removeEventListener('pause', handlePauseEvent);
    };
  }, [handleNext]);

  useEffect(() => {
    if (currentSound && audioRef.current) {
      audioRef.current.src = currentSound.src;
      audioRef.current.load();
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [currentSound]);

  const playPlaylist = useCallback((newPlaylist, startIndex = 0) => {
    setPlaylist(newPlaylist);
    setPlaylistIndex(startIndex);
    if (newPlaylist.length > 0) {
      playSound(newPlaylist[startIndex]);
    } else {
      setCurrentSound(null);
    }
  }, [playSound]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlaying]);

  const value = {
    currentSound,
    playlist,
    playlistIndex,
    isPlaying,
    audioRef,
    playSound,
    playPlaylist,
    handleNext,
    handlePrevious,
    togglePlayPause,
    setCurrentSound,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
