import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Playlists } from '../../api/playlists';
import { Comments } from '../../api/comments';
import { Groups } from '../../api/groups';
import SoundCard from '../components/SoundCard';
import SupportModal from '../components/SupportModal';

const Profile = () => {
  const { slug } = useParams();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { user, sounds, playlists, comments, groups, loading } = useTracker(() => {
    const noDataAvailable = { user: null, sounds: [], playlists: [], comments: [], groups: [], loading: true };
    let currentUser = null;

    if (!slug) {
      // Current user's profile
      const handle = Meteor.subscribe('users.me');
      if (!handle.ready()) return noDataAvailable;
      currentUser = Meteor.user();
      if (!currentUser) return noDataAvailable;
      const soundsHandle = Meteor.subscribe('sounds.private');
      const playlistsHandle = Meteor.subscribe('playlists.own');
      const commentsHandle = Meteor.subscribe('comments.byUser', currentUser._id);
      const groupsHandle = Meteor.subscribe('groups.byUser', currentUser._id);

      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const commentsReady = commentsHandle.ready();
      const groupsReady = groupsHandle.ready();

      const userSounds = Sounds.find({ userId: currentUser._id }).fetch();
      const userPlaylists = Playlists.find({ userId: currentUser._id }).fetch();
      const userComments = Comments.find({ userId: currentUser._id }).fetch();
      const commentsWithSoundTitle = userComments.map(comment => {
        const sound = Sounds.findOne(comment.soundId);
        return {
          ...comment,
          soundTitle: sound ? sound.title : 'Unknown Sound',
        };
      });
      const userGroups = Groups.find({ members: currentUser._id }).fetch();

      return { user: currentUser, sounds: userSounds, playlists: userPlaylists, comments: commentsWithSoundTitle, groups: userGroups, loading: !soundsReady || !playlistsReady || !commentsReady || !groupsReady };
    } else {
      // Other user's profile
      const handle = Meteor.subscribe('users.view', slug);
      if (!handle.ready()) return noDataAvailable;
      currentUser = Meteor.users.findOne({ 'profile.slug': slug });
      if (!currentUser) return noDataAvailable
      const soundsHandle = Meteor.subscribe('sounds.userPublic', currentUser._id);
      const playlistsHandle = Meteor.subscribe('playlists.public', currentUser._id);
      const commentsHandle = Meteor.subscribe('comments.byUser', currentUser._id);
      const groupsHandle = Meteor.subscribe('groups.byUser', currentUser._id);

      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const commentsReady = commentsHandle.ready();
      const groupsReady = groupsHandle.ready();

      const userSounds = Sounds.find({ userId: currentUser._id, isPrivate: false }).fetch();
      const userPlaylists = Playlists.find({ userId: currentUser._id, isPublic: true }).fetch();
      const otherUserComments = Comments.find({ userId: currentUser._id }).fetch();
      const otherCommentsWithSoundTitle = otherUserComments.map(comment => {
        const sound = Sounds.findOne(comment.soundId);
        return {
          ...comment,
          soundTitle: sound ? sound.title : 'Unknown Sound',
        };
      });
      const userGroups = Groups.find({ members: currentUser._id }).fetch();

      return { user: currentUser, sounds: userSounds, playlists: userPlaylists, comments: otherCommentsWithSoundTitle, groups: userGroups, loading: !soundsReady || !playlistsReady || !commentsReady || !groupsReady };
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">User not found</div>;
  }

  const isCurrentUser = Meteor.userId() === user._id;

  const handleSupportClick = () => {
    setShowSupportModal(true);
  };

  const handleCloseSupportModal = () => {
    setShowSupportModal(false);
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start">
        <img
          src={user.profile.avatar || 'https://via.placeholder.com/150'}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
        />
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{user.profile.displayName}</h1>
          <p className="text-gray-600 text-lg">@{user.profile.slug}</p>
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <div>
              <p className="text-gray-800 font-semibold">{user.profile.follows?.length || 0}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{user.profile.following?.length || 0}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{user.profile.supports?.length || 0}</p>
              <p className="text-gray-500 text-sm">Supporters</p>
            </div>
          </div>
          {!isCurrentUser && Meteor.userId() && (
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                Follow
              </button>
              <button
                onClick={handleSupportClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Support
              </button>
            </div>
          )}
          {isCurrentUser && (
            <div className="mt-6 flex justify-center md:justify-start">
              <Link to="/profile/settings" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Latest Sounds */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Sounds</h2>
        {sounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sounds.map(sound => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No sounds uploaded yet.</p>
        )}
      </div>

      {/* Playlists */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Playlists</h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map(playlist => (
              <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{playlist.name}</h3>
                <p className="text-gray-600 text-sm">{playlist.isPublic ? 'Public' : 'Private'} playlist</p>
                <p className="text-gray-500 text-xs mt-2">{playlist.items?.length || 0} tracks</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No playlists created yet.</p>
        )}
      </div>

      {/* Comments (Placeholder) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment._id} className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-gray-500 text-sm mt-2">On sound: <Link to={`/sound/${comment.soundId}`} className="text-blue-500 hover:underline">{comment.soundTitle || 'Unknown Sound'}</Link></p>
                <p className="text-gray-500 text-xs">Created at: {new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No comments made yet.</p>
        )}
      </div>

      {/* Groups (Placeholder) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Groups</h2>
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <Link to={`/group/${group.slug}`} key={group._id} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.displayName}</h3>
                <p className="text-gray-600 text-sm">{group.members?.length || 0} members</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Not a member of any groups yet.</p>
        )}
      </div>

      {showSupportModal && (
        <SupportModal userName={user.profile.displayName} onClose={handleCloseSupportModal} />
      )}
    </div>
  );
};

export default Profile;
