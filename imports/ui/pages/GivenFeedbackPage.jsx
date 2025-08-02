import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { Feedback } from '../../api/feedback';
import { Sounds } from '../../api/sounds';
import FeedbackList from '../components/FeedbackList';

const GivenFeedbackPage = () => {
  const { user, givenFeedbacks, loading } = useTracker(() => {
    const userHandle = Meteor.subscribe('users.public');
    const feedbackHandle = Meteor.subscribe('feedback.givenByUser');
    const soundsHandle = Meteor.subscribe('sounds.public'); // To get sound titles

    const user = Meteor.user();
    const givenFeedbacks = Feedback.find({ giverId: Meteor.userId() }, { sort: { createdAt: -1 } }).fetch().map(feedback => {
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

    return { user, givenFeedbacks, loading: !userHandle.ready() || !feedbackHandle.ready() || !soundsHandle.ready() };
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
        <Title>Given Feedback - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">All Given Feedbacks</h1>
      <p className="text-gray-700 mb-4">All feedbacks you have given, sorted newest to oldest.</p>
      {givenFeedbacks.length > 0 ? (
        <FeedbackList feedbacks={givenFeedbacks} />
      ) : (
        <p className="text-gray-600 italic">No feedbacks given yet.</p>
      )}
    </div>
  );
};

export default GivenFeedbackPage;
