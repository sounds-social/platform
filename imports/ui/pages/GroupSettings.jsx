import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../../api/groups';

const GroupSettings = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const { group, loading } = useTracker(() => {
    const handle = Meteor.subscribe('groups.view', groupId);
    const ready = handle.ready();
    const group = Groups.findOne(groupId);
    return { group, loading: !ready };
  }, [groupId]);

  const [name, setName] = useState(group?.name || '');
  const [slug, setSlug] = useState(group?.slug || '');
  const [members, setMembers] = useState(group?.members?.join(',') || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.callAsync('groups.update', groupId, name, slug, members.split(','))
      .then(() => history.push(`/group/${slug}`))
      .catch(err => setError(err.reason));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card w-full bg-base-100 shadow-xl my-8">
        <div className="card-body">
          <h2 className="card-title">Group Settings</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Slug</span>
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
                <span className="label-text">Members (comma separated user IDs)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Update Group</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
