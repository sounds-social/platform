import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../../api/groups';

const GroupSettings = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const { group, loading } = useTracker(() => {
    const handle = Meteor.subscribe('groups.view', groupId);
    const ready = handle.ready();
    const fetchedGroup = Groups.findOne(groupId);
    return { group: fetchedGroup, loading: !ready };
  }, [groupId]);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name || '');
      setSlug(group.slug || '');
      setMembers(group.members?.join(',') || '');
    }
  }, [group]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    Meteor.callAsync('groups.update', groupId, name, slug, members.split(',').map(m => m.trim()))
      .then(() => {
        setSuccess('Group updated successfully!');
        history.push(`/group/${slug}`);
      })
      .catch(err => setError(err.reason));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!group) {
    return <div className="text-center py-8 text-gray-600">Group not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <HeadProvider>
        <Title>Group Settings - Sounds Social</Title>
      </HeadProvider>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Group Settings</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Group Slug</label>
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
              <label htmlFor="members" className="block text-sm font-medium text-gray-700">Members (comma separated user IDs)</label>
              <div className="mt-1">
                <input
                  id="members"
                  name="members"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
