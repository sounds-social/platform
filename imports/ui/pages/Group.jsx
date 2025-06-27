import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../../api/groups';
import { Sounds } from '../../api/sounds';

const Group = () => {
  const { slug } = useParams();
  const { group, sounds, members, loading } = useTracker(() => {
    const noDataAvailable = { group: null, sounds: [], members: [], loading: true };
    const groupHandle = Meteor.subscribe('groups.view', slug);
    if (!groupHandle.ready()) return noDataAvailable;
    const group = Groups.findOne({ slug: slug });
    if (!group) return noDataAvailable;

    const soundsHandle = Meteor.subscribe('sounds.public');
    const usersHandle = Meteor.subscribe('users.view', group.members);
    const ready = soundsHandle.ready() && usersHandle.ready();

    const sounds = Sounds.find({ groupId: group._id, isPrivate: false }).fetch();
    const members = Meteor.users.find({ _id: { $in: group.members } }).fetch();

    return { group, sounds, members, loading: !ready };
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl my-8">
        <div className="card-body">
          <h2 className="card-title">{group.name}</h2>
          <p>@{group.slug}</p>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Members</div>
              <div className="stat-value">{group.members.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold mb-4">Sounds</h3>
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
        <h3 className="text-2xl font-bold mb-4">Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <div key={member._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{member.profile.displayName}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Group;
