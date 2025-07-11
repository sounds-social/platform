import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { Notifications } from './Notifications';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleDropdownClick = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/search?q=${searchTerm}`);
      setIsOpen(false);
    }
  };

  const loggedInLinks = (
    <>
      <Link onClick={handleDropdownClick} to="/" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Latest</Link>
      <Link onClick={handleDropdownClick} to="/hot" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Hot</Link>
      <Link onClick={handleDropdownClick} to="/battle" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Battle</Link>
      <Link onClick={handleDropdownClick} to="/sound/add" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Upload</Link>
    </>
  );

  const loggedOutLinks = (
    <>
      <Link onClick={handleDropdownClick} to="/sign-in" className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Sign In</Link>
      <Link onClick={handleDropdownClick} to="/sign-up" className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
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
            <Link onClick={handleDropdownClick} to="/support-overview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support Overview</Link>
          )}
          <Link onClick={handleDropdownClick} to="/payouts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payouts</Link>
          <Link onClick={handleDropdownClick}  to="/explore" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Explore</Link>
          <Link onClick={handleDropdownClick}  to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
          <a onClick={handleDropdownClick} href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Donate</a>
          <a onClick={handleDropdownClick} href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Github</a>
          <Link onClick={handleDropdownClick} to="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
          <Link onClick={handleDropdownClick} to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
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
                    <form onSubmit={handleSearch} className="flex items-center ml-4">
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm font-medium h-[38px] cursor-pointer">
                        <FiSearch />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-baseline space-x-4">
                    {loggedOutLinks}
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
                <Notifications />
                {userMenu}
              </>
            )}
          </div>
          <div className="-mr-2 flex md:hidden items-center">
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
                {user && user.plan !== 'pro' && (
                  <Link onClick={handleDropdownClick} to="/go-pro" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Go PRO</Link>
                )}
                <form onSubmit={handleSearch} className="flex items-center mt-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                  />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm font-medium h-[38px] cursor-pointer">
                    <FiSearch />
                  </button>
                </form>
              </>
            ) : loggedOutLinks}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-1">
                <Link onClick={handleDropdownClick} to="/support-overview" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Support Overview</Link>
                <Link onClick={handleDropdownClick} to="/payouts" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Payouts</Link>
                <Link onClick={handleDropdownClick} to="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Explore</Link>
                <Link onClick={handleDropdownClick} to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Profile</Link>
                <a onClick={handleDropdownClick} href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Donate</a>
                <a onClick={handleDropdownClick} href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Github</a>
                <Link onClick={handleDropdownClick} to="/profile/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Settings</Link>
                <Link onClick={handleDropdownClick} to="/logout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-700">Logout</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
