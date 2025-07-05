import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../../api/groups';
import { Sounds } from '../../api/sounds';
import SoundCard from '../components/SoundCard';

const Group = () => {
  const { slug } = useParams();
  const { group, sounds, members, loading } = useTracker(() => {
    const noDataAvailable = { group: null, sounds: [], members: [], loading: true };
    const groupHandle = Meteor.subscribe('groups.view', slug);
    const usersHandle = Meteor.subscribe('users.me');

    if (!groupHandle.ready() || !usersHandle.ready()) return noDataAvailable;

    const fetchedGroup = Groups.findOne({ slug: slug });
    if (!fetchedGroup) return noDataAvailable;

    const soundsHandle = Meteor.subscribe('sounds.public');
    const soundsReady = soundsHandle.ready();

    const groupSounds = Sounds.find({ groupId: fetchedGroup._id, isPrivate: false }).fetch();
    const groupMembers = Meteor.users.find({ _id: { $in: fetchedGroup.members } }).fetch();

    const soundsWithUserData = groupSounds.map(sound => {
      const soundUser = Meteor.users.findOne(sound.userId);
      return {
        ...sound,
        userName: soundUser ? soundUser.profile.displayName : 'Unknown',
        userSlug: soundUser ? soundUser.profile.slug : 'unknown',
      };
    });

    return { group: fetchedGroup, sounds: soundsWithUserData, members: groupMembers, loading: !soundsReady };
  }, [slug]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!group) {
    return <div className="text-center py-8 text-gray-600">Group not found</div>;
  }

  return (
    <div className="py-8">
      <HeadProvider>
        <Title>{group.name} - Sounds Social</Title>
      </HeadProvider>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start">
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          <p className="text-gray-600 text-lg">@{group.slug}</p>
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <div>
              <p className="text-gray-800 font-semibold">{group.members?.length || 0}</p>
              <p className="text-gray-500 text-sm">Members</p>
            </div>
            {/* Add Follower/Supporter counts if applicable for groups */}
          </div>
          {Meteor.userId() && group.members && !group.members.includes(Meteor.userId()) && (
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                Join Group
              </button>
            </div>
          )}
          {Meteor.userId() && group.members && group.members.includes(Meteor.userId()) && (
            <div className="mt-6 flex justify-center md:justify-start">
              <Link to={`/group/settings/${group._id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                Group Settings
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Group Sounds */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Sounds</h2>
        {sounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sounds.map(sound => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No sounds uploaded to this group yet.</p>
        )}
      </div>

      {/* Group Members */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Members</h2>
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <Link to={`/profile/${member.profile.slug}`} key={member._id} className="block bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <img
                  src={member.profile.avatar || 'https://via.placeholder.com/80'}
                  alt={member.profile.displayName}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.profile.displayName}</h3>
                <p className="text-gray-600 text-sm">@{member.profile.slug}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No members in this group yet.</p>
        )}
      </div>
    </div>
  );
};

export default Group;
