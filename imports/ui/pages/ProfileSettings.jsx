import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { HeadProvider, Title } from 'react-head';
import { Meteor } from 'meteor/meteor';
import { FiTrash } from 'react-icons/fi';
import BytescaleWidget from '../components/BytescaleWidget';

const ProfileSettings = () => {
  const user = useTracker(() => Meteor.user(), []);
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [avatar, setAvatar] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [spotify, setSpotify] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.profile?.displayName || '');
      setSlug(user.profile?.slug || '');
      setAvatar(user.profile?.avatar || '');
      setYoutube(user.profile?.youtube || '');
      setTwitter(user.profile?.twitter || '');
      setSpotify(user.profile?.spotify || '');
      setInstagram(user.profile?.instagram || '');
      setWebsite(user.profile?.website || '');
    }
  }, [user]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    Meteor.callAsync('users.updateProfile', displayName, slug, avatar, youtube, twitter, spotify, instagram, website)
      .then(() => setSuccess('Profile updated successfully.'))
      .catch(err => setError(err.reason));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword) {
      setError('Please fill in both current and new password fields.');
      return;
    }

    Accounts.changePassword(currentPassword, newPassword, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      }
    });
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to view your profile settings.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <HeadProvider>
        <Title>Profile Settings - Sounds Social</Title>
      </HeadProvider>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Profile Settings</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

          <h3 className="text-xl font-bold text-gray-900 mb-4">Update Profile Information</h3>
          <form className="space-y-6" onSubmit={handleProfileUpdate}>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Profile Slug (e.g. /profile/<span className="font-bold">my-awesome-slug</span>)</label>
              <div className="mt-1">
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar Image</label>
              <BytescaleWidget onUpload={setAvatar} initialUrl={avatar} />  
              {avatar && (
                <div className="mt-3">
                  <img src={avatar} alt="Avatar" className="w-48 h-48 object-cover rounded-lg shadow-md" />
                  <button type="button" onClick={() => setAvatar('')} className="mt-2 text-red-600 flex items-center cursor-pointer">
                    <FiTrash size={20} /> <span className="ml-2">Remove</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Links</h3>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                <div className="mt-1">
                  <input
                    id="website"
                    name="website"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">YouTube</label>
                <div className="mt-1">
                  <input
                    id="youtube"
                    name="youtube"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">X (formerly Twitter)</label>
                <div className="mt-1">
                  <input
                    id="twitter"
                    name="twitter"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                <div className="mt-1">
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="spotify" className="block text-sm font-medium text-gray-700">Spotify</label>
                <div className="mt-1">
                  <input
                    id="spotify"
                    name="spotify"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={spotify}
                    onChange={(e) => setSpotify(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button onClick={() => window.scrollTo(0,0)} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Profile
              </button>
            </div>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">E-Mail</h3>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-gray-700">{user.emails && user.emails[0] && user.emails[0].address}</p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
            <form className="space-y-6" onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="mt-1">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
