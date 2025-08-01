import React from 'react';
import { HeadProvider, Title } from 'react-head';
import { FiUsers, FiCode, FiZap, FiMusic } from 'react-icons/fi';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

const About = () => {
  const userId = useTracker(() => Meteor.userId());

  return (
    <div className="bg-gray-50">
      <HeadProvider>
        <Title>About - Sounds Social</Title>
      </HeadProvider>
      {/* Hero Section */}
      <div className="relative rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Sounds Social</span>
                </h1>
                <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Find Your Next Collab. Share Your Beats. Grow Together.
                </p>
                {!userId && (
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/sign-up"
                        className="w-full flex items-center justify-center px-8 py-3 border-2 border-violet-500 text-base font-medium rounded-md text-violet-500 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                      >
                        Join Beta
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img 
            className="h-40 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" 
            src="https://plus.unsplash.com/premium_photo-1682125896993-12a1758b6cb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt=""
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiUsers className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Swipe to find<br/>your next collab</h2>
            <p className="text-gray-600">Connect with other musicians and find your next collaboration with our intuitive matching system.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiZap className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Annoying Ads</h2>
            <p className="text-gray-600">Enjoy an ad-free experience. Focus on the music, not on interruptions.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiMusic className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Give Feedback.<br/>Get Feedback</h2>
            <p className="text-gray-600">Improve your music by getting valuable feedback from other musicians, and help others by sharing your insights.</p>
          </div>
        </div>
      </div>

      {/* Monetization Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Monetization</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-200">
                  <span className="font-bold">Support the artists you love directly.</span> 70% of your PRO plan subscription will go directly to the musicians you choose to support. We believe in transparency, so you'll always know where your money is going. It's our commitment to building a fair and sustainable ecosystem for creators.
                </p>
              </div>
            </div>
            <div className="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 max-h-[400px]">
              <img className="rounded-md object-cover object-left-top" src="https://plus.unsplash.com/premium_photo-1680721445241-f06bc430a6fb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="App screenshot" />
            </div>
          </div>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FiCode className="text-5xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Open Source
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Sounds Social is open source. We believe in transparency and community collaboration.
            </p>
            <div className="mt-6">
              <a href="https://github.com/sounds-social/platform" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Contribute on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
