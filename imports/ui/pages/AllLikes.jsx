import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import SoundList from '../components/SoundList';

const AllLikes = () => {
  const { slug } = useParams();

  const { likedSounds, loading, user } = useTracker(() => {
    const noDataAvailable = { likedSounds: [], loading: true, user: null };

    const userHandle = Meteor.subscribe('users.view', slug);
    if (!userHandle.ready()) return noDataAvailable;

    const currentUser = Meteor.users.findOne({ 'profile.slug': slug });
    if (!currentUser) return noDataAvailable;

    const likedSoundsHandle = Meteor.subscribe('sounds.likedByUser', currentUser._id);

    if (!likedSoundsHandle.ready()) return noDataAvailable;

    const sounds = Sounds.find({ 'likes.userId': currentUser._id })
      .fetch()
      .map(sound => {
        const like = sound.likes.find(like => like.userId === currentUser._id);
        return { ...sound, likedAt: like.likedAt };
      })
      .sort((a, b) => b.likedAt - a.likedAt);

    return { likedSounds: sounds, loading: false, user: currentUser };
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">User not found</div>;
  }

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>All Liked Sounds by {user.profile.displayName} - Sounds Social</Title>
      </HeadProvider>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        All Liked Sounds by <Link to={`/profile/${user.profile.slug}`} className="text-blue-500 hover:underline">{user.profile.displayName}</Link>
      </h1>
      <SoundList sounds={likedSounds} loading={loading} noSoundsMessage="No liked sounds yet." />
    </div>
  );
};

export default AllLikes;
