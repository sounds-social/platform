import React, { useState } from 'react';
import Modal from 'react-modal';
import { Meteor } from 'meteor/meteor';

const RequestFeedbackModal = ({ isOpen, onRequestClose, soundId }) => {
  const [requests, setRequests] = useState(1);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    setError(null); // Clear previous errors
    try {
      await Meteor.callAsync('sounds.requestFeedback', soundId, requests);
      onRequestClose();
    } catch (err) {
      setError(err.reason || 'An unknown error occurred.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Request Feedback"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Feedback</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="requests" className="block text-sm font-medium text-gray-700">Amount of coins to spend</label>
            <input
              type="number"
              id="requests"
              min="1"
              max="10"
              value={requests}
              onChange={(e) => setRequests(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              onClick={handleRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequestFeedbackModal;
