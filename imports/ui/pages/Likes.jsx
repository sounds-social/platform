import React from 'react';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

const Likes = () => {
  const { likedSounds, loading } = useTracker(() => {
    const noDataAvailable = { likedSounds: [], loading: true };
    const userId = Meteor.userId();
    if (!userId) {
      return noDataAvailable;
    }
    const handle = Meteor.subscribe('sounds.likedByUser', userId);
    const ready = handle.ready();
    const sounds = Sounds.find({ likes: userId }, { sort: { createdAt: -1 } }).fetch();

    return { likedSounds: sounds, loading: !ready };
  }, []);

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>Liked Sounds - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Liked Sounds</h1>
      <SoundList sounds={likedSounds} loading={loading} noSoundsMessage="You haven't liked any sounds yet." />
    </div>
  );
};

export default Likes;
