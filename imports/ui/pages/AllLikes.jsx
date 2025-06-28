import React from 'react';
import { useParams } from 'react-router-dom';
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

    const sounds = Sounds.find({ likes: currentUser._id }, { sort: { createdAt: -1 } }).fetch();

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Liked Sounds by {user.profile.displayName}</h1>
      <SoundList sounds={likedSounds} loading={loading} noSoundsMessage="No liked sounds yet." />
    </div>
  );
};

export default AllLikes;
