import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { format } from "date-fns";
import { useHistory } from 'react-router-dom';
import { Sounds } from '../../api/sounds';
import { PlaylistsCollection as Playlists } from '../../api/playlists';
import { Comments } from '../../api/comments';
import { Groups } from '../../api/groups';
import { FaYoutube, FaTwitter, FaSpotify, FaInstagram, FaGlobe } from 'react-icons/fa';
import SoundList from '../components/SoundList';
import SupportModal from '../components/SupportModal';

const Profile = () => {
  const { slug } = useParams();
  const history = useHistory();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { usersBeingFollowed, user, sounds, playlists, comments, groups, loading, likedSounds, totalLikedSoundsCount, totalCommentsCount, totalPlaylistsCount } = useTracker(() => {
    const noDataAvailable = { user: null, sounds: [], playlists: [], comments: [], groups: [], loading: true, likedSounds: [] };
    let currentUser = null;

    if (!slug) {
      // Current user's profile
      const handle = Meteor.subscribe('users.me');
      if (!handle.ready()) return noDataAvailable;
      currentUser = Meteor.user();
      if (!currentUser) return noDataAvailable;
      const soundsHandle = Meteor.subscribe('sounds.private');
      const playlistsHandle = Meteor.subscribe('playlists.myPlaylists');
      const commentsHandle = Meteor.subscribe('comments.byUser', currentUser._id);
      const groupsHandle = Meteor.subscribe('groups.byUser', currentUser._id);
      const likedSoundsHandle = Meteor.subscribe('sounds.likedByUser', currentUser._id);

      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const commentsReady = commentsHandle.ready();
      const groupsReady = groupsHandle.ready();
      const likedSoundsReady = likedSoundsHandle.ready();

      const userSounds = Sounds.find({ userId: currentUser._id }, { sort: { createdAt: -1 } }).fetch();
      const userPlaylists = Playlists.find({ ownerId: currentUser._id }, { sort: { createdAt: -1 }, limit: 4 }).fetch();
      const totalPlaylistsCount = Playlists.find({ ownerId: currentUser._id }).count();
      const userComments = Comments.find({ userId: currentUser._id }, { sort: { createdAt: -1 }, limit: 3 }).fetch();
      const totalCommentsCount = Comments.find({ userId: currentUser._id }).count();
      const commentsWithSoundTitle = userComments.map(comment => {
        const sound = Sounds.findOne(comment.soundId);
        return {
          ...comment,
          soundTitle: sound ? sound.title : 'Unknown Sound',
        };
      });
      const userGroups = Groups.find({ members: currentUser._id }).fetch();
      const likedSounds = Sounds.find({ 'likes.userId': currentUser._id })
        .fetch()
        .map(sound => {
          const like = sound.likes.find(like => like.userId === currentUser._id);
          return { ...sound, likedAt: like.likedAt };
        })
        .sort((a, b) => b.likedAt - a.likedAt)
        .slice(0, 4);

      const usersBeingFollowed = Meteor.users.find({
        'profile.follows': currentUser._id
      }).fetch()

      const totalLikedSoundsCount = Sounds.find({ 'likes.userId': currentUser._id }).count();

      return { 
        usersBeingFollowed, 
        user: currentUser, 
        sounds: userSounds, 
        playlists: userPlaylists, 
        comments: commentsWithSoundTitle, 
        groups: userGroups, 
        loading: !soundsReady || !playlistsReady || !commentsReady || !groupsReady || !likedSoundsReady, 
        likedSounds,
        totalLikedSoundsCount,
        totalCommentsCount,
        totalPlaylistsCount
      };
    } else {
      if (slug === Meteor.user()?.profile?.slug) {
        history.push('/profile');
        return noDataAvailable;
      }

      // Other user's profile
      const handle = Meteor.subscribe('users.view', slug);
      if (!handle.ready()) return noDataAvailable;
      currentUser = Meteor.users.findOne({ 'profile.slug': slug });
      if (!currentUser) return noDataAvailable
      const soundsHandle = Meteor.subscribe('sounds.public', currentUser._id);
      const playlistsHandle = Meteor.subscribe('playlists.publicPlaylistsForUser', currentUser._id);
      const commentsHandle = Meteor.subscribe('comments.byUser', currentUser._id);
      const groupsHandle = Meteor.subscribe('groups.byUser', currentUser._id);
      const likedSoundsHandle = Meteor.subscribe('sounds.likedByUser', currentUser._id);

      const soundsReady = soundsHandle.ready();
      const playlistsReady = playlistsHandle.ready();
      const commentsReady = commentsHandle.ready();
      const groupsReady = groupsHandle.ready();
      const likedSoundsReady = likedSoundsHandle.ready();

      const userSounds = Sounds.find({ userId: currentUser._id, isPrivate: false }, { sort: { createdAt: -1 } }).fetch();
      const userPlaylists = Playlists.find({ ownerId: currentUser._id, isPublic: true }, { sort: { createdAt: -1 }, limit: 4 }).fetch();
      const totalPlaylistsCount = Playlists.find({ ownerId: currentUser._id, isPublic: true }).count();
      const otherUserComments = Comments.find({ userId: currentUser._id }, { sort: { createdAt: -1 }, limit: 3 }).fetch();
      const otherCommentsWithSoundTitle = otherUserComments.map(comment => {
        const sound = Sounds.findOne(comment.soundId);

        return {
          ...comment,
          soundTitle: sound ? sound.title : 'Unknown Sound',
        };
      });
      const userGroups = Groups.find({ members: currentUser._id }).fetch();
      const likedSounds = Sounds.find({ 'likes.userId': currentUser._id })
        .fetch()
        .map(sound => {
          const like = sound.likes.find(like => like.userId === currentUser._id);
          return { ...sound, likedAt: like.likedAt };
        })
        .sort((a, b) => b.likedAt - a.likedAt)
        .slice(0, 4);

      const totalLikedSoundsCount = Sounds.find({ 'likes.userId': currentUser._id }).count();
      const totalCommentsCount = Comments.find({ userId: currentUser._id }).count();

      const usersBeingFollowed = Meteor.users.find({
        'profile.follows': currentUser._id
      }).fetch()

      return { 
        usersBeingFollowed, 
        user: currentUser, 
        sounds: userSounds, 
        playlists: userPlaylists, 
        comments: otherCommentsWithSoundTitle, 
        groups: userGroups, 
        loading: !soundsReady || !playlistsReady || !commentsReady || !groupsReady || !likedSoundsReady, 
        likedSounds, 
        totalLikedSoundsCount,
        totalCommentsCount,
        totalPlaylistsCount
      };
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">User not found</div>;
  }

  const isCurrentUser = Meteor.userId() === user._id;
  const isFollowing = Meteor.user()?.profile?.follows?.includes(user._id);
  const hasSocialLinks = user.profile.website || user.profile.youtube || user.profile.twitter || user.profile.instagram || user.profile.spotify;

  const handleSupportClick = () => {
    setShowSupportModal(true);
  };

  const handleCloseSupportModal = () => {
    setShowSupportModal(false);
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await Meteor.callAsync('users.unfollow', user._id);
      } else {
        await Meteor.callAsync('users.follow', user._id);
      }
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
    }
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start">
        {user.profile.avatar ? (
          <img
            src={user.profile.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-5xl font-bold">
            {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : ''}
          </div>
        )}
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{user.profile.displayName}</h1>
          <p className="text-gray-600 text-lg">@{user.profile.slug}</p>
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <div>
              <p className="text-gray-800 font-semibold">{usersBeingFollowed.length || 0}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{user.profile.follows?.length || 0}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            {/* <div>
              <p className="text-gray-800 font-semibold">{user.profile.supports?.length || 0}</p>
              <p className="text-gray-500 text-sm">Supporters</p>
            </div> */}
          </div>
          {hasSocialLinks && (
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              {user.profile.website && (
                <a href={user.profile.website} target="_blank" rel="noopener noreferrer">
                  <FaGlobe className="text-gray-500 hover:text-gray-700" size={24} />
                </a>
              )}
              {user.profile.youtube && (
                <a href={user.profile.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="text-red-600 hover:text-red-800" size={24} />
                </a>
              )}
              {user.profile.twitter && (
                <a href={user.profile.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-blue-400 hover:text-blue-600" size={24} />
                </a>
              )}
              {user.profile.instagram && (
                <a href={user.profile.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-pink-500 hover:text-pink-700" size={24} />
                </a>
              )}
              {user.profile.spotify && (
                <a href={user.profile.spotify} target="_blank" rel="noopener noreferrer">
                  <FaSpotify className="text-green-500 hover:text-green-700" size={24} />
                </a>
              )}
            </div>
          )}
          {!isCurrentUser && Meteor.userId() && (
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              <button
                onClick={handleFollowToggle}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              {/* <button
                onClick={handleSupportClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Support
              </button> */}
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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content - Sounds */}
        <div className="md:w-3/4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sounds</h2>
          <SoundList sounds={sounds} loading={loading} noSoundsMessage="No sounds uploaded yet." />
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Liked Sounds */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Likes</h2>
            {likedSounds.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {likedSounds.map(sound => (
                  <Link to={`/sound/${sound._id}`} key={sound._id}>
                    <div className="relative aspect-square">
                      <img src={sound.coverImage} alt={sound.title} className="object-cover w-full h-full rounded-lg" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No liked sounds yet.</p>
            )}
            {totalLikedSoundsCount > 4 && (
              <div className="text-center mt-4">
                <Link to={`/profile/${user.profile.slug}/likes`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                  Load More
                </Link>
              </div>
            )}
          </div>

          {/* Playlists */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Playlists</h2>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {playlists.map(playlist => (
                  <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
                    <div className="relative aspect-square">
                      {playlist.coverImageUrl ? (
                        <img src={playlist.coverImageUrl} alt={playlist.name} className="object-cover w-full h-full rounded-lg" />
                      ) : (
                        <div className="w-full h-full rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white text-5xl font-bold">
                          {playlist.name ? playlist.name.charAt(0).toUpperCase() : ''}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No playlists found.</p>
            )}
            {totalPlaylistsCount > 4 && (
              <div className="text-center mt-4">
                <Link to={`/profile/${user.profile.slug}/playlists`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                  Load More
                </Link>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment._id} className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-800 text-sm">{comment.content}</p>
                    <p className="text-gray-500 text-xs mt-2">On sound: <Link to={`/sound/${comment.soundId}`} className="text-blue-500 hover:underline">{comment.soundTitle || 'Unknown Sound'}</Link></p>
                    <p className="text-gray-500 text-xs">Created at: {format(new Date(comment.createdAt), "dd.MM.yyyy - HH:mm")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No comments made yet.</p>
            )}
            {totalCommentsCount > 3 && (
              <div className="text-center mt-4">
                <Link to={`/profile/${user.profile.slug}/comments`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                  Load More
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Groups (Placeholder)
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
      </div> */}

      {showSupportModal && (
        <SupportModal userName={user.profile.displayName} onClose={handleCloseSupportModal} />
      )}
    </div>
  );
};

export default Profile;
