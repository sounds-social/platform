import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { Link } from 'react-router-dom';
import { Sounds } from '../../api/sounds';
import { Feedback } from '../../api/feedback';
import SoundList from '../components/SoundList';
import FeedbackList from '../components/FeedbackList';

const FeedbackPage = () => {
  const { user, requestedSounds, receivedFeedbacks, loading } = useTracker(() => {
    const userHandle = Meteor.subscribe('users.public');
    const soundsHandle = Meteor.subscribe('sounds.feedbackRequested');
    const feedbackHandle = Meteor.subscribe('feedback.forUser');

    const user = Meteor.user();
    const requestedSounds = Sounds.find({ feedbackRequests: { $gte: 1 } }, { sort: { feedbackRequests: -1 } }).fetch().map(sound => {
      const soundUser = Meteor.users.findOne(sound.userId);
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    const receivedFeedbacks = Feedback.find({}, { sort: { createdAt: -1 } }).fetch().map(feedback => {
      const giver = Meteor.users.findOne(feedback.giverId);
      const sound = Sounds.findOne(feedback.soundId);
      return {
        ...feedback,
        giverName: giver ? giver.profile.displayName : 'Anonymous',
        giverSlug: giver ? giver.profile.slug : 'unknown',
        soundTitle: sound ? sound.title : 'Unknown Sound',
        soundSlug: sound ? sound.slug : 'unknown',
      };
    });

    return { user, requestedSounds, receivedFeedbacks, loading: !userHandle.ready() || !soundsHandle.ready() || !feedbackHandle.ready() };
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
        <p className="text-gray-700 mb-4">Start earning coins by giving feedback (0.5 coins per feedback. You can have 10 coins max.)</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedbacks Requested</h2>
        <p className="text-gray-700 mb-4">Sounds that have feedback requests, sorted by most requests to lowest.</p>
        {requestedSounds.length > 0 ? (
          <SoundList 
            sounds={requestedSounds}
            defaultDisplayLimit={3}
            loadMoreAmount={5}
            hidePlayButton={true}
          />
        ) : (
          <p className="text-gray-600 italic">No sounds found.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedbacks Received</h2>
        <p className="text-gray-700 mb-4">Feedbacks given for your sounds.</p>
        {receivedFeedbacks.length > 0 ? (
          <FeedbackList feedbacks={receivedFeedbacks.slice(0, 3)} />
        ) : (
          <p className="text-gray-600 italic">No feedbacks received yet.</p>
        )}
        {receivedFeedbacks.length > 3 && (
          <div className="text-center mt-4">
            <Link
              to="/feedback/received"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Show All
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
