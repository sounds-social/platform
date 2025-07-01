import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(null); // { src, title, id }
  const [playlist, setPlaylist] = useState([]); // Array of { src, title, id }
  const [playlistIndex, setPlaylistIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false); // New state for looping
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
      if (playlist.length === 0) {
        return prevIndex; // Do nothing if no playlist
      }

      const nextIndex = (prevIndex + 1);
      if (nextIndex >= playlist.length) {
        if (isLooping) {
          playSound(playlist[0]);
          return 0;
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
          return prevIndex; // Stay on the last song
        }
      } else {
        playSound(playlist[nextIndex]);
        return nextIndex;
      }
    });
  }, [playlist, playSound, isLooping]); // Add isLooping to dependencies

  const handlePrevious = useCallback(() => {
    setPlaylistIndex(prevIndex => {
      if (playlist.length === 0) {
        return prevIndex; // Do nothing if no playlist
      }
      // If not looping and at the first song, do nothing
      if (!isLooping && prevIndex === 0) {
        return prevIndex;
      }
      const prevIndexCalculated = (prevIndex - 1 + playlist.length) % playlist.length;
      playSound(playlist[prevIndexCalculated]);
      return prevIndexCalculated;
    });
  }, [playlist, playSound, isLooping]);

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
    if (audioRef.current) {
      audioRef.current.loop = (playlist.length === 0 && isLooping); // Set loop property for single sound
    }
  }, [isLooping, playlist.length]);

  useEffect(() => {
    if (currentSound && audioRef.current) {
      audioRef.current.src = currentSound.src;
      audioRef.current.load();
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.loop = false; // Ensure loop is off when no sound
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

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  const value = {
    currentSound,
    playlist,
    playlistIndex,
    isPlaying,
    isLooping, // Expose isLooping
    audioRef,
    playSound,
    playPlaylist,
    handleNext,
    handlePrevious,
    togglePlayPause,
    toggleLoop, // Expose toggleLoop
    setCurrentSound,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
