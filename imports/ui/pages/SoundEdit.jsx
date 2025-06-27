import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';

const SoundEdit = () => {
  const { soundId } = useParams();
  const history = useHistory();
  const { sound, loading } = useTracker(() => {
    const handle = Meteor.subscribe('sounds.private');
    const ready = handle.ready();
    const fetchedSound = Sounds.findOne(soundId);
    return { sound: fetchedSound, loading: !ready };
  }, [soundId]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (sound) {
      setTitle(sound.title || '');
      setDescription(sound.description || '');
      setTags(sound.tags?.join(',') || '');
      setCoverImage(sound.coverImage || '');
      setIsPrivate(sound.isPrivate || false);
      setBackgroundImage(sound.backgroundImage || '');
    }
  }, [sound]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    Meteor.callAsync('sounds.update', soundId, title, description, tags.split(',').map(tag => tag.trim()), coverImage, isPrivate, backgroundImage)
      .then(() => {
        setSuccess('Sound updated successfully!');
        history.push(`/sound/${soundId}`);
      })
      .catch(err => setError(err.reason));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!sound) {
    return <div className="text-center py-8 text-gray-600">Sound not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Edit Sound</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <div className="mt-1">
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
              <div className="mt-1">
                <input
                  id="coverImage"
                  name="coverImage"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">Background Image URL (Optional)</label>
              <div className="mt-1">
                <input
                  id="backgroundImage"
                  name="backgroundImage"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isPrivate"
                name="isPrivate"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">Make this sound private</label>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Sound
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoundEdit;