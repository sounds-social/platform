import React from 'react';
import { FiShare2, FiDollarSign, FiCode } from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Sounds Social</h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl">Share your sound with the world. Connect with other musicians and get discovered.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiShare2 className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sharing</h2>
            <p className="text-gray-600">Upload your music and share it with our community.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiDollarSign className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Monetization</h2>
            <p className="text-gray-600">Monetize your work by receiving support from your fans.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiCode className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Open Source</h2>
            <p className="text-gray-600">Sounds Social is open source. <a className="underline" href="https://github.com/sounds-social/platform">Contribute on Github.</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
