import React, { useState } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { FiMenu, FiX, FiInbox } from 'react-icons/fi';
import { Notifications } from './Notifications';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messages';
import SearchBar from './SearchBar';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = { color: '#3B82F6' };

  const unreadMessagesCount = useTracker(() => {
    if (!user) return 0;
    Meteor.subscribe('messages');
    return Messages.find({ toUserId: user._id, isRead: false }).count();
  }, [user]);

  const handleDropdownClick = () => setIsOpen(false);

  const loggedInLinks = (
    <>
      <NavLink exact onClick={handleDropdownClick} to="/" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
      <NavLink onClick={handleDropdownClick} to="/hot" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Hot</NavLink>
      <NavLink onClick={handleDropdownClick} to="/sound/add" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Upload</NavLink>
    </>
  );

  const loggedOutLinks = (
    <>
      <NavLink exact onClick={handleDropdownClick} to="/" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
      <NavLink onClick={handleDropdownClick} to="/hot" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Hot</NavLink>
      <NavLink onClick={handleDropdownClick} to="/sign-in" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Sign In</NavLink>
      <NavLink onClick={handleDropdownClick} to="/sign-up" activeStyle={{ backgroundColor: '#2563EB' }} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</NavLink>
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
          
          {user && user.plan === 'pro' && (
            <NavLink onClick={handleDropdownClick} to="/support-overview" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support Overview</NavLink>
          )}
          <NavLink onClick={handleDropdownClick} to="/payouts" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payouts</NavLink>
          <NavLink onClick={handleDropdownClick}  to="/explore" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Explore</NavLink>
          <NavLink onClick={handleDropdownClick} to="/battle" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Battle Pit</NavLink>
          <NavLink exact onClick={handleDropdownClick}  to="/profile" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</NavLink>
          <a onClick={handleDropdownClick} href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Donate</a>
          <a onClick={handleDropdownClick} href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Github</a>
          <NavLink onClick={handleDropdownClick} to="/profile/settings" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</NavLink>
          <NavLink onClick={handleDropdownClick} to="/logout" activeStyle={activeLinkStyle} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</NavLink>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link onClick={handleDropdownClick} to="/" className="text-xl font-bold text-blue-500">Sounds Social</Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline">
                {user ? (
                  <>
                    <div className="flex items-baseline space-x-4">
                      {loggedInLinks}
                    </div>
                    <SearchBar />
                  </>
                ) : (
                  <div className="flex items-baseline space-x-4">
                    <NavLink exact onClick={handleDropdownClick} to="/" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
                    <NavLink onClick={handleDropdownClick} to="/hot" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Hot</NavLink>
                    <NavLink onClick={handleDropdownClick} to="/sign-in" activeStyle={activeLinkStyle} className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Sign In</NavLink>
                    <NavLink onClick={handleDropdownClick} to="/sign-up" activeStyle={{ backgroundColor: '#2563EB' }} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</NavLink>
                    <SearchBar />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {user && user.plan !== 'pro' && (
              <Link onClick={handleDropdownClick} to="/go-pro" className="text-blue-500 font-bold px-3 py-2 rounded-md text-sm mr-4">Go PRO</Link>
            )}
            {user && (
              <>
                <Link to="/messages" className="relative text-gray-600 hover:text-blue-500 pr-4 py-2 rounded-md text-sm font-medium">
                  <FiInbox className="h-6 w-6" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </Link>
                <Notifications />
                {userMenu}
              </>
            )}
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            {user && user.plan !== 'pro' && (
              <Link onClick={handleDropdownClick} to="/go-pro" className="text-blue-500 font-bold px-3 py-2 rounded-md text-sm mr-4">Go PRO</Link>
            )}
                                    {user && <Link to="/messages" className="relative text-gray-600 hover:text-blue-500 pr-4 py-2 rounded-md text-sm font-medium">
              <FiInbox className="h-6 w-6" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500" />
              )}
            </Link>}
            {user && <Notifications />}
            <button onClick={() => setIsOpen(!isOpen)} className="ml-4 bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                {loggedInLinks}
                <div className="mt-4">
                  <SearchBar />
                </div>
              </>
            ) : (
              <>
                {loggedOutLinks}
                <div className="mt-4">
                  <SearchBar />
                </div>
              </>
            )}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                {user && user.plan === 'pro' && (
                  <NavLink onClick={handleDropdownClick} to="/support-overview" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Support Overview</NavLink>
                )}
                <NavLink onClick={handleDropdownClick} to="/payouts" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Payouts</NavLink>
                <NavLink onClick={handleDropdownClick} to="/explore" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Explore</NavLink>
                <NavLink onClick={handleDropdownClick} to="/battle" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Battle Pit</NavLink>
                <NavLink exact onClick={handleDropdownClick} to="/profile" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Profile</NavLink>
                <a onClick={handleDropdownClick} href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Donate</a>
                <a onClick={handleDropdownClick} href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Github</a>
                <NavLink onClick={handleDropdownClick} to="/profile/settings" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Settings</NavLink>
                <NavLink onClick={handleDropdownClick} to="/logout" activeStyle={activeLinkStyle} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Logout</NavLink>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
