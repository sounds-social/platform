import React from 'react';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import Unauthorized from '../components/Unauthorized';

const GoPro = () => {
  const { user, loggingIn } = useTracker(() => {
    const subscription = Meteor.subscribe('users.me');
    return {
      user: Meteor.user(),
      loggingIn: !subscription.ready(),
    };
  });

  const handleGoProClick = async () => {
    try {
      const checkoutUrl = await Meteor.callAsync('stripe.createCheckoutSession');
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      // Optionally, display an error message to the user
    }
  };

  if (loggingIn) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <HeadProvider>
        <Title>Go PRO - Sounds Social</Title>
      </HeadProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2>
          <p className="mt-4 text-lg text-gray-600">Start sharing your sounds or go PRO to support artists and unlock more features.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-lg font-medium text-gray-900">Free</h3>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $0
                <span className="ml-1 text-2xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-5 text-lg text-gray-500">Perfect for getting started and sharing your music.</p>
            </div>
            <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
              <ul role="list" className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Upload as many sounds as you want</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Connect with other musicians</p>
                </li>
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full bg-gray-200 border border-transparent rounded-md py-3 px-6 text-center text-base font-medium text-gray-800 hover:bg-gray-300"
                >
                  Current Plan
                </a>
              </div>
            </div>
          </div>

          {/* PRO Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
            <div className="px-6 py-8 sm:p-10">
              <h3 className="text-lg font-medium text-gray-900">PRO</h3>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $20
                <span className="ml-1 text-2xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-5 text-lg text-gray-500">Unlock full potential and support the community.</p>
            </div>
            <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
              <ul role="list" className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">All Free features</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Support your favorite musicians</p>
                </li>
              </ul>
              <div className="mt-8">
                <button
                  onClick={handleGoProClick}
                  className="block w-full bg-blue-600 border border-transparent rounded-md py-3 px-6 text-center text-base font-medium text-white hover:bg-blue-700"
                >
                  Go PRO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoPro;
