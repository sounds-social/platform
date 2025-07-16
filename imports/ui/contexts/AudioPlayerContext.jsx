import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(null); // { src, title, id, hideTitle? }
  const [playlist, setPlaylist] = useState([]); // Array of { src, title, id }
  const [playlistIndex, setPlaylistIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false); // New state for looping
  const [duration, setDuration] = useState(0); // New state for duration
  const audioRef = useRef(null);

  const playSingleSound = useCallback((sound, startTime = 0) => {
    setCurrentSound({ ...sound, startTime });
    setPlaylist([]); // Clear the playlist
    setPlaylistIndex(-1); // Reset the playlist index
  }, []);

  const handleNext = useCallback(() => {
    setPlaylistIndex(prevIndex => {
      if (playlist.length === 0) {
        // If a single sound is playing and looping is enabled, do nothing (native loop handles it)
        if (isLooping && currentSound) {
          return prevIndex;
        }
        return prevIndex; // Do nothing if no playlist and not looping
      }

      const nextIndex = (prevIndex + 1);
      if (nextIndex >= playlist.length) {
        if (isLooping) {
          setCurrentSound(playlist[0]);
          return 0;
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
          return prevIndex; // Stay on the last song
        }
      } else {
        setCurrentSound(playlist[nextIndex]);
        return nextIndex;
      }
    });
  }, [playlist, isLooping, currentSound, setCurrentSound]);

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
      setCurrentSound(playlist[prevIndexCalculated]);
      return prevIndexCalculated;
    });
  }, [playlist, isLooping, setCurrentSound]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    // Only add ended listener if there's a playlist to navigate
    if (playlist.length > 0) {
      audio.addEventListener('ended', handleNext);
    }
    audio.addEventListener('play', handlePlayEvent);
    audio.addEventListener('pause', handlePauseEvent);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      if (playlist.length > 0) {
        audio.removeEventListener('ended', handleNext);
      }
      audio.removeEventListener('play', handlePlayEvent);
      audio.removeEventListener('pause', handlePauseEvent);
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, [handleNext, playlist.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = (playlist.length === 0 && isLooping); // Set loop property for single sound
    }
  }, [isLooping, playlist.length, audioRef.current]);

  useEffect(() => {
    if (currentSound && audioRef.current) {
      audioRef.current.src = currentSound.src;
      audioRef.current.load();

      const handleLoadedMetadata = () => {
        if (currentSound.startTime) {
          console.log(currentSound.startTime)
          audioRef.current.currentTime = currentSound.startTime;
        }
        audioRef.current.play();
        Meteor.call('sounds.incrementPlayCount', currentSound.id);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

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
      setCurrentSound(newPlaylist[startIndex]);
    } else {
      setCurrentSound(null);
    }
  }, []);

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
    duration, // Expose duration
    audioRef,
    playSingleSound,
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
