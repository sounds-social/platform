import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/">Latest</Link>
              <Link to="/hot">Hottest</Link>
              <Link to="/explore">Explore</Link>
            </>
          ) : (
            <>
              <Link to="/about">About</Link>
              <Link to="/sign-in">Sign In</Link>
              <Link to="/sign-up">Sign Up</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link to="/go-pro">Go PRO</Link>
              <Link to={`/profile/${user.profile.slug}`}>Profile</Link>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <FiMenu />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to="/about">About</Link></li>
                  <li><a href="https://ko-fi.com/itsmatteodemicheli" target="_blank" rel="noopener noreferrer">Donate</a></li>
                  <li><a href="https://github.com/sounds-social/platform" target="_blank" rel="noopener noreferrer">Github</a></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
