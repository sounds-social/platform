import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const ProfileSettings = () => {
  const user = useTracker(() => Meteor.user());
  const [displayName, setDisplayName] = useState(user?.profile?.displayName || '');
  const [slug, setSlug] = useState(user?.profile?.slug || '');
  const [avatar, setAvatar] = useState(user?.profile?.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    Meteor.callAsync('users.updateProfile', displayName, slug, avatar)
      .then(() => setSuccess('Profile updated successfully.'))
      .catch(err => setError(err.reason));
  };

  return (
    <div className="container mx-auto">
      <div className="card w-full bg-base-100 shadow-xl my-8">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleProfileUpdate}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Slug</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
