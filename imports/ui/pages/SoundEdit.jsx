import React, { useState } from 'react';
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
    const sound = Sounds.findOne(soundId);
    return { sound, loading: !ready };
  }, [soundId]);

  const [title, setTitle] = useState(sound?.title || '');
  const [description, setDescription] = useState(sound?.description || '');
  const [tags, setTags] = useState(sound?.tags?.join(',') || '');
  const [coverImage, setCoverImage] = useState(sound?.coverImage || '');
  const [isPrivate, setIsPrivate] = useState(sound?.isPrivate || false);
  const [backgroundImage, setBackgroundImage] = useState(sound?.backgroundImage || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.callAsync('sounds.update', soundId, title, description, tags.split(','), coverImage, isPrivate, backgroundImage)
      .then(() => history.push(`/sound/${soundId}`))
      .catch(err => setError(err.reason));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sound) {
    return <div>Sound not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card w-full bg-base-100 shadow-xl my-8">
        <div className="card-body">
          <h2 className="card-title">Edit Sound</h2>
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
              <button type="submit" className="btn btn-primary">Update Sound</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoundEdit;
