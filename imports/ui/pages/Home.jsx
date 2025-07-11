import React from 'react';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

const Home = () => {
  const { sounds, loading } = useTracker(() => {
    const noDataAvailable = { sounds: [], loading: true };
    const privateHandle = Meteor.subscribe('sounds.private');
    const publicHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.me');
    const publicUsersHandle = Meteor.subscribe('users.public');

    if (!privateHandle.ready() || !publicHandle.ready() || !usersHandle.ready() || !publicUsersHandle.ready()) return noDataAvailable;

    const user = Meteor.user();
    if (!user) return noDataAvailable;

    const following = user.profile.follows || [];
    const userIds = [Meteor.userId(), ...following];
    const soundsData = Sounds.find({ userId: { $in: userIds } }, { sort: { createdAt: -1 } }).fetch();

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
      <HeadProvider>
        <Title>Latest Sounds - Sounds Social</Title>
      </HeadProvider>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Sounds</h2>
      <p className="text-gray-500 mb-6">See the latest sounds from users you follow and your own uploads.</p>
      <SoundList sounds={sounds} loading={loading} noSoundsMessage="No sounds found. Upload your first sound or follow other users." />
    </div>
  );
};

export default Home;
