import React from 'react';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';
import { Link } from 'react-router-dom';

const Discover = () => {
  const { newestSounds, newestLoading, trapSounds, trapLoading, hotSounds, hotLoading } = useTracker(() => {
    const handles = [
      Meteor.subscribe('sounds.public'),
      Meteor.subscribe('users.public')
    ];

    const loading = handles.some(handle => !handle.ready());

    const sounds = Sounds.find({ isPrivate: { $ne: true } }, { sort: { createdAt: -1 } }).fetch();
    const soundsWithUserData = sounds.map(sound => {
      const user = Meteor.users.findOne({ _id: sound.userId }, { fields: { 'profile.displayName': 1, 'profile.slug': 1 } });
      return {
        ...sound,
        userName: user ? user.profile.displayName : 'Unknown',
        userSlug: user ? user.profile.slug : 'unknown',
      };
    });

    const trapSoundsData = soundsWithUserData.filter(sound => sound.tags && sound.tags.includes('trap beat'));
    const hotSoundsData = [...soundsWithUserData].sort((a, b) => (b.playCount || 0) - (a.playCount || 0));


    return {
      newestSounds: soundsWithUserData,
      newestLoading: loading,
      trapSounds: trapSoundsData,
      trapLoading: loading,
      hotSounds: hotSoundsData,
      hotLoading: loading
    };
  }, []);

  return (
    <div className="my-8">
      <HeadProvider>
        <Title>Discover - Sounds Social</Title>
      </HeadProvider>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Discover</h2>
      <p className="text-gray-500 mb-6">Discover new sounds from the community.</p>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mt-8">#trap beat</h3>
        <p className="text-gray-500 mb-4">Listen to the latest trap beats from the community.</p>
        <SoundList sounds={trapSounds} loading={trapLoading} noSoundsMessage="No sounds with the tag 'trap beat' found." defaultDisplayLimit={3} loadMoreAmount={5} />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mt-8">Newest Sounds</h3>
        <p className="text-gray-500 mb-4">The latest sounds uploaded to the platform.</p>
        <SoundList sounds={newestSounds} loading={newestLoading} noSoundsMessage="No new sounds found." defaultDisplayLimit={3} loadMoreAmount={5} />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mt-8">Hottest Sounds</h3>
        <p className="text-gray-500 mb-4">The most popular sounds right now.</p>
        <SoundList sounds={hotSounds} loading={hotLoading} noSoundsMessage="No hot sounds found." defaultDisplayLimit={3} hidePlayButton={true} />
        <Link to="/hot" className="text-blue-500 mt-4 inline-block">View all hot sounds</Link>
      </div>
    </div>
  );
};

export default Discover;