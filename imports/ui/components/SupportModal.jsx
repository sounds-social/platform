import React from 'react';
import { Link } from 'react-router-dom';

const SupportModal = ({ userName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 mx-auto rounded-md shadow-lg text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">You are now supporting {userName}!</h3>
        <p className="text-gray-700 mb-6">
          Your monthly contribution helps support {userName} and the Sounds Social platform.
        </p>
        <p className="text-gray-700 mb-6">
          Want to see how your money is being used?
        </p>
        <Link
          to="/support-overview"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          onClick={onClose}
        >
          View Support Overview
        </Link>
        <button
          onClick={onClose}
          className="mt-4 block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SupportModal;
