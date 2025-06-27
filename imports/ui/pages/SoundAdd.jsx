import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import UploadcareWidget from '../components/UploadcareWidget';

const SoundAdd = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [audioFile, setAudioFile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    Meteor.callAsync('sounds.insert', title, description, tags.split(',').map(tag => tag.trim()), coverImage, isPrivate, backgroundImage, audioFile)
      .then(() => {
        setSuccess('Sound added successfully!');
        setTitle('');
        setDescription('');
        setTags('');
        setCoverImage('');
        setIsPrivate(false);
        setBackgroundImage('');
        setAudioFile('');
        history.push('/'); // Redirect to home after successful addition
      })
      .catch(err => setError(err.reason));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Add New Sound</h2>
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
                  className="p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
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
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image</label>
              <UploadcareWidget onUpload={setCoverImage} />
            </div>

            <div>
              <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">Background Image (Optional)</label>
              <UploadcareWidget onUpload={setBackgroundImage} />
            </div>

            <div>
              <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700">Audio File</label>
              <UploadcareWidget onUpload={setAudioFile} />
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
                Add Sound
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoundAdd;
