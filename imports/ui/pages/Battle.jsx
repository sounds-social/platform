
import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { FiThumbsUp, FiPlay } from "react-icons/fi";
import { Sounds } from '../../api/sounds';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Link } from 'react-router-dom';

const Battle = () => {
  const [step, setStep] = useState('intro'); // intro, battle, result
  const [sounds, setSounds] = useState([]);
  const [winner, setWinner] = useState(null);
  const [battleCounter, setBattleCounter] = useState(0); // New state to force re-subscription
  const { playSingleSound } = useAudioPlayer();

  const { soundsReady, randomSounds } = useTracker(() => {
    // Re-subscribe to sounds.random whenever battleCounter changes
    const handle = Meteor.subscribe('sounds.random', battleCounter);
    const usersHandle = Meteor.subscribe('users.public');
    return {
      soundsReady: handle.ready() && usersHandle.ready(),
      randomSounds: Sounds.find().fetch(),
    };
  }, [battleCounter]); // Add battleCounter to dependencies

  useEffect(() => {
    if (soundsReady && randomSounds.length >= 2) {
      setSounds([randomSounds[0], randomSounds[1]]);
    }
  }, [soundsReady, randomSounds]);

  const handleStart = () => {
    setStep('battle');
  };

  const handleVote = (winnerId) => {
    const winnerSound = sounds.find(s => s._id === winnerId);
    const user = Meteor.users.findOne(winnerSound.userId);
    winnerSound.userName = user.profile.displayName;
    setWinner(winnerSound);
    Meteor.callAsync('sounds.winBattle', winnerId);
    setStep('result');
  };

  const handleNext = () => {
    setWinner(null);
    setBattleCounter(prev => prev + 1); // Increment to force re-subscription
    setStep('battle');
  };

  const handlePlay = (sound) => {
    playSingleSound({ src: sound.audioFile, title: sound.title, id: sound._id });
  }

  if (step === 'intro') {
    return (
      <div className="text-center my-20 p-8 rounded-lg">
        <h1 className="text-6xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 mb-4 animate-pulse-slow">Sounds Battle</h1>
        <p className="mb-8 font-medium text-xl text-purple-950">Which sound slaps harder? You decide.<br/>Press the thumbs up button to choose the winner.</p>
        <button onClick={handleStart} className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out transform hover:scale-105">Enter the Battle</button>
      </div>
    );
  }

  if (step === 'battle') {
    if (sounds.length < 2) {
      return <div>Loading sounds...</div>;
    }
    return (
      <div className="flex flex-col md:flex-row justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center mx-4 p-6 bg-gray-900 rounded-lg shadow-neon-blue transform hover:scale-105 transition-all duration-300">
          <img src={sounds[0].coverImage} alt={sounds[0].title} className="rounded-lg w-64 h-64 object-cover mb-4 shadow-lg shadow-purple-500/50" />
          <div className="flex space-x-2">
            <button onClick={() => handlePlay(sounds[0])} className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-blue transition-all duration-300 ease-in-out">
              <FiPlay size={20} />
            </button>
            <button onClick={() => handleVote(sounds[0]._id)} className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out">
              <FiThumbsUp size={20} />
            </button>
          </div>
        </div>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mx-10 my-8 md:my-0">VS</div>
        <div className="flex flex-col items-center mx-4 p-6 bg-gray-900 rounded-lg shadow-neon-blue transform hover:scale-105 transition-all duration-300">
          <img src={sounds[1].coverImage} alt={sounds[1].title} className="rounded-lg w-64 h-64 object-cover mb-4 shadow-lg shadow-purple-500/50" />
          <div className="flex space-x-2">
            <button onClick={() => handlePlay(sounds[1])} className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-blue transition-all duration-300 ease-in-out">
              <FiPlay size={20} />
            </button>
            <button onClick={() => handleVote(sounds[1]._id)} className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out">
              <FiThumbsUp size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="text-center mb-14 rounded-lg shadow-neon-purple">
        <h2 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Winner!</h2>
        {winner && (
          <div className="p-6 bg-gray-900 rounded-lg shadow-neon-blue inline-block transform hover:scale-105 transition-all duration-300">
            <Link to={`/sound/${winner._id}`} target="_blank" rel="noopener noreferrer">
              <img src={winner.coverImage} alt={winner.title} className="rounded-lg w-64 h-64 object-cover mx-auto mb-4 shadow-lg shadow-purple-500/50" />
              <h3 className="text-xl font-bold text-pink-400 text-shadow-neon">{winner.title}</h3>
            </Link>
            <p className="text-purple-300">by {winner.userName}</p>
          </div>
        )}
        <button onClick={handleNext} className="block mx-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-neon-pink transition-all duration-300 ease-in-out transform hover:scale-105 mt-8">Next Battle</button>
      </div>
    );
  }

  return null;
};

export default Battle;
