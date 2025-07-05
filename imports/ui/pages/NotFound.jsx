import React from 'react';
import { Link } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <HeadProvider>
        <Title>Page Not Found - Sounds Social</Title>
      </HeadProvider>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-center text-6xl font-extrabold text-gray-900">404</h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Page not found.
        </p>
        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
