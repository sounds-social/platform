import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

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

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Sounds</h2>
      <p className="text-gray-500 mb-6">Discover random sounds from across the platform.</p>
      <SoundList sounds={sounds} loading={loading} noSoundsMessage="No sounds to explore yet." />
    </div>
  );
};

export default Explore;
