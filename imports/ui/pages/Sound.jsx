import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Comments } from '../../api/comments';

const Sound = () => {
  const { soundId } = useParams();
  const { sound, comments, loading } = useTracker(() => {
    const noDataAvailable = { sound: null, comments: [], loading: true };
    const soundHandle = Meteor.subscribe('sounds.public');
    const commentsHandle = Meteor.subscribe('comments.forSound', soundId);
    const ready = soundHandle.ready() && commentsHandle.ready();
    const sound = Sounds.findOne(soundId);
    const comments = Comments.find({ soundId: soundId }).fetch();
    return { sound, comments, loading: !ready };
  }, [soundId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sound) {
    return <div>Sound not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl my-8">
        <figure>
          <img src={sound.coverImage || 'https://via.placeholder.com/150'} alt="Cover" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{sound.title}</h2>
          <p>{sound.description}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Play</button>
            <button className="btn btn-secondary">Like</button>
            <button className="btn btn-accent">Add to Playlist</button>
          </div>
        </div>
      </div>

      <div className="my-8">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        <div className="grid grid-cols-1 gap-4">
          {comments.map(comment => (
            <div key={comment._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sound;
