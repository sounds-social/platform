import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Comments } from '../../api/comments';
import { FiPlay, FiHeart, FiPlus, FiMessageSquare } from 'react-icons/fi';

const Sound = () => {
  const { soundId } = useParams();
  const [commentContent, setCommentContent] = useState('');
  const [commentTimestamp, setCommentTimestamp] = useState('');

  const { sound, comments, loading } = useTracker(() => {
    const noDataAvailable = { sound: null, comments: [], loading: true };
    const soundHandle = Meteor.subscribe('sounds.public');
    const commentsHandle = Meteor.subscribe('comments.forSound', soundId);
    const usersHandle = Meteor.subscribe('users.public');

    const ready = soundHandle.ready() && commentsHandle.ready() && usersHandle.ready();
    const fetchedSound = Sounds.findOne(soundId);
    const fetchedComments = Comments.find({ soundId: soundId }, { sort: { createdAt: 1 } }).fetch();

    if (fetchedSound) {
      const soundUser = Meteor.users.findOne(fetchedSound.userId);
      fetchedSound.userName = soundUser ? soundUser.profile.displayName : 'Unknown';
      fetchedSound.userSlug = soundUser ? soundUser.profile.slug : 'unknown';
    }

    return { sound: fetchedSound, comments: fetchedComments, loading: !ready };
  }, [soundId]);

  const handlePlay = () => {
    if (sound) {
      Meteor.call('sounds.incrementPlayCount', soundId);
      // Here you would integrate with an actual audio player
      alert(`Playing: ${sound.title}`);
    }
  };

  const handleLike = () => {
    if (sound) {
      Meteor.call('sounds.like', soundId);
      alert(`Liked: ${sound.title}`);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      Meteor.call('comments.insert', soundId, commentContent, commentTimestamp);
      setCommentContent('');
      setCommentTimestamp('');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!sound) {
    return <div className="text-center py-8 text-gray-600">Sound not found</div>;
  }

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row">
        <div className="md:flex-shrink-0">
          <img
            src={sound.coverImage || 'https://via.placeholder.com/300'}
            alt={sound.title}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 flex-grow">
          <h1 className="text-4xl font-extrabold text-gray-900">{sound.title}</h1>
          <p className="text-lg text-gray-600 mt-2">
            by <Link to={`/profile/${sound.userSlug}`} className="text-blue-500 hover:underline">{sound.userName}</Link>
          </p>
          <p className="text-gray-700 mt-4">{sound.description}</p>

          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center text-gray-600">
              <FiPlay className="mr-2 text-xl" />
              <span>{sound.playCount || 0} Plays</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiHeart className="mr-2 text-xl" />
              <span>{sound.likesCount || 0} Likes</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiMessageSquare className="mr-2 text-xl" />
              <span>{comments.length} Comments</span>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handlePlay}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200"
            >
              <FiPlay className="mr-2" /> Play
            </button>
            <button
              onClick={handleLike}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200"
            >
              <FiHeart className="mr-2" /> Like
            </button>
            <button
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200"
            >
              <FiPlus className="mr-2" /> Add to Playlist
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          ></textarea>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Timestamp (optional, e.g., 0:30)"
            value={commentTimestamp}
            onChange={(e) => setCommentTimestamp(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Post Comment
          </button>
        </form>

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-gray-800">{comment.userName || 'Anonymous'}</p>
                  {comment.timestamp && (
                    <span className="ml-3 text-sm text-gray-500">({comment.timestamp})</span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default Sound;