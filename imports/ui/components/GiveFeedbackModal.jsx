import React, { useState } from 'react';
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';
import { Rating } from '@smastrom/react-rating';

const GiveFeedbackModal = ({ isOpen, onRequestClose, soundId }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (content.length >= 50 && content.length <= 1000) {
      await Meteor.callAsync('feedback.insert', soundId, content, rating);
      onRequestClose();
    } else {
      alert('Feedback content must be between 50 and 1000 characters.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Give Feedback"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Give Feedback</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Feedback Content</label>
            <textarea
              id="content"
              rows="5"
              cols="50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              minLength="50"
              maxLength="1000"
            ></textarea>
            <p className="text-sm text-gray-500">{content.length} / 1000 characters (min. 50)</p>
          </div>
          <div className="max-w-[100px]">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <Rating
              value={rating}
              onChange={setRating}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onRequestClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GiveFeedbackModal;
