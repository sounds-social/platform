import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-8 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          {new Date().getFullYear()} Sounds Social
        </div>
        <div>
          <a href="https://discord.gg/Je3P3gQ9u5" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mr-4">
            Discord
          </a>
          <Link to="/about" className="text-blue-500 hover:underline text-sm mr-4">
            About
          </Link>
          <Link to="/terms-of-service" className="text-blue-500 hover:underline text-sm mr-4">
            Terms of Service
          </Link>
          <Link to="/privacy-policy" className="text-blue-500 hover:underline text-sm">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
