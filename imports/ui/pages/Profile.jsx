import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Playlists } from '../../api/playlists';
import { Comments } from '../../api/comments';
import { Groups } from '../../api/groups';

const Profile = () => {
  const { slug } = useParams();
  const { user, sounds, playlists, comments, groups, loading } = useTracker(() => {
    const noDataAvailable = { user: null, sounds: [], playlists: [], comments: [], groups: [], loading: true };
    if (!slug) {
      const handle = Meteor.subscribe('users.me');
      if (!handle.ready()) return noDataAvailable;
      const user = Meteor.user();
      if (!user) return noDataAvailable;
      const soundsHandle = Meteor.subscribe('sounds.private');
      const playlistsHandle = Meteor.subscribe('playlists.own');
      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const sounds = Sounds.find({ userId: user._id }).fetch();
      const playlists = Playlists.find({ userId: user._id }).fetch();
      return { user, sounds, playlists, comments: [], groups: [], loading: !soundsReady || !playlistsReady };
    } else {
      const handle = Meteor.subscribe('users.view', slug);
      if (!handle.ready()) return noDataAvailable;
      const user = Meteor.users.findOne({ 'profile.slug': slug });
      if (!user) return noDataAvailable;
      const soundsHandle = Meteor.subscribe('sounds.public');
      const playlistsHandle = Meteor.subscribe('playlists.public', user._id);
      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const sounds = Sounds.find({ userId: user._id, isPrivate: false }).fetch();
      const playlists = Playlists.find({ userId: user._id, isPublic: true }).fetch();
      return { user, sounds, playlists, comments: [], groups: [], loading: !soundsReady || !playlistsReady };
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl my-8">
        <figure>
          <img src={user.profile.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{user.profile.displayName}</h2>
          <p>@{user.profile.slug}</p>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Followers</div>
              <div className="stat-value">{user.profile.follows.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Following</div>
              <div className="stat-value">{user.profile.follows.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Supporters</div>
              <div className="stat-value">{user.profile.supports.length}</div>
            </div>
          </div>
          <div className="card-actions justify-end">
            {Meteor.userId() && Meteor.userId() !== user._id && (
              <button className="btn btn-primary">Follow</button>
            )}
            {Meteor.userId() && Meteor.userId() !== user._id && (
              <button className="btn btn-secondary">Support</button>
            )}
          </div>
        </div>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold mb-4">Latest Sounds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sounds.map(sound => (
            <div key={sound._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{sound.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold mb-4">Playlists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(playlist => (
            <div key={playlist._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{playlist.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
