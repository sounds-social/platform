import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundCard from '../components/SoundCard';

const Explore = () => {
  const { sounds, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], loading: true };
    const handle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');

    if (!handle.ready() || !usersHandle.ready()) return noDataAvailable;

    const soundsData = Sounds.find({}).fetch();
    // Fisher-Yates shuffle
    for (let i = soundsData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [soundsData[i], soundsData[j]] = [soundsData[j], soundsData[i]];
    }

    const soundsWithUserData = soundsData.map(sound => {
      const soundUser = Meteor.users.findOne({ _id: sound.userId }, { fields: { 'profile.displayName': 1, 'profile.slug': 1 } });
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    return { sounds: soundsWithUserData, loading: false };
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (sounds.length === 0) {
    return <div className="text-center py-8 text-gray-600">No sounds to explore yet.</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore Sounds</h2>
      <div className="grid grid-cols-1 gap-6">
        {sounds.map(sound => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>
    </div>
  );
};

export default Explore;