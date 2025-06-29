import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-8 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Sounds Social
        </div>
        <div>
          <Link to="/terms-of-service" className="text-blue-500 hover:underline text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
