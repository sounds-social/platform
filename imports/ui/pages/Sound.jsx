import React, { useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Comments } from '../../api/comments';
import { FiPlay, FiHeart, FiPlus, FiMessageSquare, FiEdit, FiTrash2 } from 'react-icons/fi';
import AudioPlayer from '../components/AudioPlayer';
import AddPlaylistModal from '../components/AddPlaylistModal';

const Sound = () => {
  const { soundId } = useParams();
  const history = useHistory();
  const [commentContent, setCommentContent] = useState('');
  const [commentTimestamp, setCommentTimestamp] = useState('');
  const [currentPlayingSound, setCurrentPlayingSound] = useState(null);
  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);

  const { sound, comments, loading, userHasLiked } = useTracker(() => {
    const noDataAvailable = { sound: null, comments: [], loading: true, userHasLiked: false };
    const soundHandle = Meteor.subscribe('sounds.public');
    const commentsHandle = Meteor.subscribe('comments.forSound', soundId);
    const usersHandle = Meteor.subscribe('users.public');
    const userId = Meteor.userId();

    const ready = soundHandle.ready() && commentsHandle.ready() && usersHandle.ready();
    const fetchedSound = Sounds.findOne(soundId);
    const fetchedComments = Comments.find({ soundId: soundId }, { sort: { createdAt: 1 } }).fetch();

    const commentsWithUserData = fetchedComments.map(comment => {
      const commentUser = Meteor.users.findOne(comment.userId);
      return {
        ...comment,
        userName: commentUser ? commentUser.profile.displayName : 'Anonymous',
        userSlug: commentUser ? commentUser.profile.slug : 'unknown',
      };
    }).reverse();

    if (fetchedSound) {
      const soundUser = Meteor.users.findOne(fetchedSound.userId);
      fetchedSound.userName = soundUser ? soundUser.profile.displayName : 'Unknown';
      fetchedSound.userSlug = soundUser ? soundUser.profile.slug : 'unknown';
    }

    const liked = fetchedSound && fetchedSound.likes && fetchedSound.likes.some(like => like.userId === userId);

    return { sound: fetchedSound, comments: commentsWithUserData, loading: !ready, userHasLiked: liked };
  }, [soundId]);

  const handlePlay = () => {
    if (sound) {
      Meteor.call('sounds.incrementPlayCount', soundId);
      setCurrentPlayingSound(sound.audioFile);
    }
  };

  const handleLike = () => {
    if (sound) {
      Meteor.call('sounds.toggleLike', soundId);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      await Meteor.callAsync('comments.insert', soundId, commentContent, commentTimestamp);
      setCommentContent('');
      setCommentTimestamp('');
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this sound?')) {
      await Meteor.callAsync('sounds.remove', soundId);
      history.push('/');
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
      {sound.backgroundImage && (
        <div
          className="relative w-full h-64 bg-cover bg-center rounded-lg shadow-md mb-8"
          style={{ backgroundImage: `url(${sound.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
        </div>
      )}
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

          {sound.tags && sound.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sound.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/search?q=${tag}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-3 py-1 rounded-full transition duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center text-gray-600">
              <FiPlay className="mr-2 text-xl" />
              <span>{sound.playCount || 0} {sound.playCount === 1 ? 'Play' : 'Plays'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiHeart className="mr-2 text-xl" />
              <span>{sound.likeCount || 0} {sound.likeCount === 1 ? 'Like' : 'Likes'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiMessageSquare className="mr-2 text-xl" />
              <span>{comments.length}  {comments.length === 1 ? 'Comment' : 'Comments'}</span>
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
              className={`flex items-center font-bold py-3 px-6 rounded-md transition duration-200 ${
                userHasLiked
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <FiHeart className={`mr-2 ${userHasLiked ? 'fill-current' : ''}`} /> {userHasLiked ? 'Unlike' : 'Like'}
            </button>
            <button
              onClick={() => setIsAddPlaylistModalOpen(true)}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200"
            >
              <FiPlus className="mr-2" /> Add to Playlist
            </button>
            {Meteor.userId() === sound.userId && (
              <Link
                to={`/sounds/${soundId}/edit`}
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200"
              >
                <FiEdit className="mr-2" /> Edit
              </Link>
            )}
            {Meteor.userId() === sound.userId && (
              <button
                onClick={handleRemove}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition duration-200"
              >
                <FiTrash2 className="mr-2" /> Remove
              </button>
            )}
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
                  <p className="font-semibold text-gray-800">
                    <Link to={`/profile/${comment.userSlug}`} className="text-blue-500 hover:underline">
                      {comment.userName}
                    </Link>
                  </p>
                  <span className="ml-auto text-sm text-gray-500">{new Date(comment.createdAt).toString()}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {currentPlayingSound && (
        <AudioPlayer src={currentPlayingSound} onClose={() => setCurrentPlayingSound(null)} />
      )}

      <AddPlaylistModal
        isOpen={isAddPlaylistModalOpen}
        onRequestClose={() => setIsAddPlaylistModalOpen(false)}
        soundId={soundId}
      />
    </div>
  );
};

export default Sound;
