import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { Feedback } from '../../api/feedback';
import { Sounds } from '../../api/sounds';
import FeedbackList from '../components/FeedbackList';

const ReceivedFeedbackPage = () => {
  const { user, receivedFeedbacks, loading } = useTracker(() => {
    const userHandle = Meteor.subscribe('users.public');
    const feedbackHandle = Meteor.subscribe('feedback.forUser');
    const soundsHandle = Meteor.subscribe('sounds.public'); // To get sound titles

    const user = Meteor.user();
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

    return { user, receivedFeedbacks, loading: !userHandle.ready() || !feedbackHandle.ready() || !soundsHandle.ready() };
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">Please log in to view your feedback.</div>;
  }

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>Received Feedback - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">All Received Feedbacks</h1>
      <p className="text-gray-700 mb-4">All feedbacks given for your sounds, sorted newest to oldest.</p>
      {receivedFeedbacks.length > 0 ? (
        <FeedbackList feedbacks={receivedFeedbacks} />
      ) : (
        <p className="text-gray-600 italic">No feedbacks received yet.</p>
      )}
    </div>
  );
};

export default ReceivedFeedbackPage;
