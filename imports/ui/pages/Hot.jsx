import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';
import { subDays } from 'date-fns';

const Hot = () => {
  const { sounds, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], loading: true };
    const handle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.public');

    if (!handle.ready() || !usersHandle.ready()) return noDataAvailable;

    const thirtyDaysAgo = subDays(new Date(), 30);

    const soundsData = Sounds.find({
      createdAt: { $gte: thirtyDaysAgo },
    }, { sort: { playCount: -1 }, limit: 20 }).fetch();

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
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Hottest Sounds</h2>
      <p className="text-gray-500 mb-6">Sounds with the most plays in the last 30 days.</p>
      <SoundList sounds={sounds} loading={loading} noSoundsMessage="No hot sounds to display yet." />
    </div>
  );
};

export default Hot;
