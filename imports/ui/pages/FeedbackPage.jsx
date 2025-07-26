import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

const FeedbackPage = () => {
  const { user, requestedSounds, loading } = useTracker(() => {
    const userHandle = Meteor.subscribe('users.public');
    const soundsHandle = Meteor.subscribe('sounds.feedbackRequested');
    const user = Meteor.user();
    const requestedSounds = Sounds.find({}, { sort: { feedbackRequests: -1 } }).fetch();
    return { user, requestedSounds, loading: !userHandle.ready() || !soundsHandle.ready() };
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">Please log in to view your feedback.</div>;
  }

  const feedbackCoins = user.profile?.feedbackCoins || 0;

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>Feedback - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Feedback</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Coins: {feedbackCoins}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedbacks Requested</h2>
        <p className="text-gray-700 mb-4">Sounds that have feedback requests, sorted by most requests to lowest.</p>
        {requestedSounds.length > 0 ? (
          <SoundList sounds={requestedSounds} hidePlayButton={true} />
        ) : (
          <p className="text-gray-600 italic">No sounds found.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
