
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
      <div className="text-center my-20">
        <h1 className="text-6xl w-full text-transparent bg-clip-text font-extrabold bg-linear-65 bg-gradient-to-r from-purple-500 to-pink-500 p-2 mb-4">Sounds Battle</h1>
        <p className="mb-8 font-medium text-lg">Which sound slaps harder? You decide.<br/>Press the thumbs up button to choose the winner.</p>
        <button onClick={handleStart} className="bg-linear-65 from-purple-500 to-pink-500 cursor-pointer hover:animate-pulse text-white px-6 py-3 rounded-md">Continue</button>
      </div>
    );
  }

  if (step === 'battle') {
    if (sounds.length < 2) {
      return <div>Loading sounds...</div>;
    }
    return (
      <div className="flex justify-center items-center">
        <div className="text-center mx-4">
          <img src={sounds[0].coverImage} alt={sounds[0].title} className="rounded-lg w-64 h-64 object-cover mb-4 shadow-xl" />
          <button onClick={() => handlePlay(sounds[0])} className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md mr-2">
            <FiPlay size={20} />
          </button>
          <button onClick={() => handleVote(sounds[0]._id)} className="cursor-pointer bg-linear-65 from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md">
            <FiThumbsUp size={20} />
          </button>
        </div>
        <div className="text-2xl font-bold mx-10">versus</div>
        <div className="text-center mx-4">
          <img src={sounds[1].coverImage} alt={sounds[1].title} className="rounded-lg w-64 h-64 object-cover mb-4 shadow-xl" />
          <button onClick={() => handlePlay(sounds[1])} className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md mr-2">
            <FiPlay size={20} />
          </button>
          <button onClick={() => handleVote(sounds[1]._id)} className="cursor-pointer bg-linear-65 from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md">
            <FiThumbsUp size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Winner!</h2>
        {winner && (
          <div>
            <Link to={`/sound/${winner._id}`} target="_blank" rel="noopener noreferrer">
              <img src={winner.coverImage} alt={winner.title} className="rounded-lg shadow-xl w-64 h-64 object-cover mx-auto mb-4" />
              <h3 className="text-xl font-bold">{winner.title}</h3>
            </Link>
            <p>by {winner.userName}</p>
          </div>
        )}
        <button onClick={handleNext} className="bg-linear-65 from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md mt-8">Next Battle</button>
      </div>
    );
  }

  return null;
};

export default Battle;
