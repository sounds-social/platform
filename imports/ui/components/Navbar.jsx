import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const loggedInLinks = (
    <>
      <Link to="/" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Latest</Link>
      <Link to="/hot" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Hot</Link>
      <Link to="/explore" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Explore</Link>
      <Link to="/sound/add" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Upload</Link>
    </>
  );

  const loggedOutLinks = (
    <>
      <Link to="/sign-in" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Sign In</Link>
      <Link to="/sign-up" className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
    </>
  );

  const userMenu = user && (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 focus:outline-none">
        <span className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Menu</span>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          
          <Link to="/support-overview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support Overview</Link>
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
          <a href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Donate</a>
          <a href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Github</a>
          <Link to="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
          <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-500">Sounds Social</Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user ? loggedInLinks : loggedOutLinks}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {user && (
              <Link to="/go-pro" className="text-blue-500 font-bold px-3 py-2 rounded-md text-sm mr-4">Go PRO</Link>
            )}
            {userMenu}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? loggedInLinks : loggedOutLinks}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                <Link to="/sound/add" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Upload</Link>
                <Link to={`/profile/${user.profile.slug}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Profile</Link>
                <a href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Donate</a>
                <a href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Github</a>
                <Link to="/logout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Logout</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
