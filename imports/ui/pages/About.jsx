import React from 'react';
import { FiShare2, FiDollarSign, FiCode } from 'react-icons/fi';

const About = () => {
  return (
    <div>
      <div className="hero min-h-screen" style={{ backgroundImage: `url('https://source.unsplash.com/random/1600x900?music')` }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Sounds Social</h1>
            <p className="mb-5">Share your sound with the world. Connect with other musicians and get discovered.</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiShare2 className="text-5xl mb-4" />
              <h2 className="card-title">Sharing</h2>
              <p>Upload your music and share it with our community.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiDollarSign className="text-5xl mb-4" />
              <h2 className="card-title">Monetization</h2>
              <p>Monetize your work by receiving support from your fans.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <FiCode className="text-5xl mb-4" />
              <h2 className="card-title">Open Source</h2>
              <p>Sounds Social is open source. Contribute on Github.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
