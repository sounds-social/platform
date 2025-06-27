import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.callAsync('sounds.insert', title, description, tags.split(','), coverImage, isPrivate, backgroundImage, audioFile)
      .then(() => history.push('/'))
      .catch(err => setError(err.reason));
  };

  return (
    <div className="container mx-auto">
      <div className="card w-full bg-base-100 shadow-xl my-8">
        <div className="card-body">
          <h2 className="card-title">Add Sound</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tags (comma separated)</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cover Image URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Background Image URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Audio File URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={audioFile}
                onChange={(e) => setAudioFile(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Private</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Add Sound</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoundAdd;
