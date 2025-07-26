import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";
import { Rating } from '@smastrom/react-rating';

const FeedbackList = ({ feedbacks }) => {
  return (
    <div className="space-y-6">
      {feedbacks.map(feedback => (
        <div key={feedback._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-2">
            <p className="font-semibold text-gray-800">
              Feedback for <Link to={`/sound/${feedback.soundId}`} className="text-blue-500 hover:underline">{feedback.soundTitle}</Link>
            </p>
            <span className="ml-4 text-sm text-gray-500">{formatDistanceToNow(new Date(feedback.createdAt))} ago</span>
          </div>
          <p className="text-gray-700 mb-2">{feedback.content}</p>
          {feedback.rating > 0 && (
            <div className="flex items-center">
              <Rating value={feedback.rating} readOnly={true} style={{ maxWidth: 100 }} />
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">Given by <Link to={`/profile/${feedback.giverSlug}`} className="text-blue-500 hover:underline">{feedback.giverName}</Link></p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
