
import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { FiThumbsUp } from "react-icons/fi";
import { Sounds } from '../../api/sounds';

const Battle = () => {
  const [step, setStep] = useState('intro'); // intro, battle, result
  const [sounds, setSounds] = useState([]);
  const [winner, setWinner] = useState(null);

  const { soundsReady, randomSounds } = useTracker(() => {
    const handle = Meteor.subscribe('sounds.random');
    return {
      soundsReady: handle.ready(),
      randomSounds: Sounds.find().fetch(),
    };
  }, []);

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
    setWinner(winnerSound);
    Meteor.callAsync('sounds.winBattle', winnerId);
    setStep('result');
  };

  const handleNext = () => {
    setWinner(null);
    const newSounds = Sounds.find().fetch();
    if (newSounds.length >= 2) {
        setSounds([newSounds[0], newSounds[1]]);
    }
    setStep('battle');
  };

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
          <img src={sounds[0].coverImage} alt={sounds[0].title} className="w-64 h-64 object-cover mb-4 shadow-xl" />
          <button onClick={() => handleVote(sounds[0]._id)} className="cursor-pointer bg-linear-65 from-purple-500 to-pink-500 text-white px-6 py-3 rounded-md">
            <FiThumbsUp size={20} />
          </button>
        </div>
        <div className="text-2xl font-bold mx-10">versus</div>
        <div className="text-center mx-4">
          <img src={sounds[1].coverImage} alt={sounds[1].title} className="w-64 h-64 object-cover mb-4 shadow-xl" />
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
        <h2 className="text-2xl font-bold mb-4">Winner!</h2>
        {winner && (
          <div>
            <img src={winner.coverImage} alt={winner.title} className="w-64 h-64 object-cover mx-auto mb-4" />
            <h3 className="text-xl font-bold">{winner.title}</h3>
            <p>by {winner.userId}</p>
          </div>
        )}
        <button onClick={handleNext} className="bg-blue-500 text-white px-6 py-3 rounded-md mt-8">Next Battle</button>
      </div>
    );
  }

  return null;
};

export default Battle;
