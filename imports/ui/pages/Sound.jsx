import React, { useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Sounds } from '../../api/sounds';
import { Comments } from '../../api/comments';
import { FiPlay, FiHeart, FiPlus, FiMessageSquare, FiEdit, FiTrash2, FiAward, FiShare2, FiLoader } from 'react-icons/fi';
import Modal from 'react-modal';
import { format, formatDistanceToNow } from "date-fns";
import AddPlaylistModal from '../components/AddPlaylistModal';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

Modal.setAppElement('#react-target');

const Sound = () => {
  const { soundId } = useParams();
  const history = useHistory();
  const [commentContent, setCommentContent] = useState('');
  const [commentTimestamp, setCommentTimestamp] = useState('');
  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);
  const [isCreateSnippetModalOpen, setIsCreateSnippetModalOpen] = useState(false);
  const [snippetStartTime, setSnippetStartTime] = useState(0);
  const [snippetEndTime, setSnippetEndTime] = useState(30);
  const [snippetUrl, setSnippetUrl] = useState(null);
  const [isCreatingSnippet, setIsCreatingSnippet] = useState(false);
  const { playSingleSound } = useAudioPlayer();

  const { sound, comments, loading, userHasLiked } = useTracker(() => {
    const noDataAvailable = { sound: null, comments: [], loading: true, userHasLiked: false };
    const soundHandle = Meteor.subscribe('sounds.singleSound', soundId);
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
      playSingleSound({ src: sound.audioFile, title: sound.title, id: soundId });
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

  const handleRemoveComment = async (commentId) => {
    if (window.confirm('Are you sure you want to remove this comment?')) {
      await Meteor.callAsync('comments.remove', commentId);
    }
  };

  const handleCreateSnippet = async () => {
    if (sound) {
      setIsCreatingSnippet(true);
      try {
        const result = await Meteor.callAsync('snippets.create', sound._id, parseFloat(snippetStartTime), parseFloat(snippetEndTime));
        setSnippetUrl(result);
      } catch (error) {
        console.error('Error creating snippet:', error);
      } finally {
        setIsCreatingSnippet(false);
      }
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
      <HeadProvider>
        <Title>{sound.title} - Sounds Social</Title>
      </HeadProvider>
      {sound.backgroundImage && (
        <div
          className="relative w-full h-64 bg-cover bg-center rounded-lg shadow-md mb-8"
          style={{ backgroundImage: `url(${sound.backgroundImage})` }}
        >
          <div className="absolute inset-0 rounded-lg"></div>
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
          <h1 className="text-4xl font-extrabold text-gray-900">{sound.title}
            {sound.isPrivate && (
              <span className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded-full">Private</span>
            )}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            by <Link to={`/profile/${sound.userSlug}`} className="text-blue-500 hover:underline">{sound.userName}</Link> &bull; {formatDistanceToNow(new Date(sound.createdAt))} ago
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

          <div className="flex flex-wrap items-center mt-6">
            <div className="flex items-center text-gray-600 mb-4 mr-6">
              <FiPlay className="mr-2 text-xl" />
              <span>{sound.playCount || 0} {sound.playCount === 1 ? 'Play' : 'Plays'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4 mr-6">
              <FiHeart className="mr-2 text-xl" />
              <span>{sound.likeCount || 0} {sound.likeCount === 1 ? 'Like' : 'Likes'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4 mr-6">
              <FiMessageSquare className="mr-2 text-xl" />
              <span>{comments.length}  {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4 mr-6">
              <FiAward className="mr-2 text-xl" />
              <span>Battles Won: {sound.battlesWonCount || 0}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap">
            <button
              onClick={handlePlay}
              className="cursor-pointer flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 mr-4 mb-4 flex-shrink-0"
            >
              <FiPlay className="mr-2" /> Play
            </button>
            {Meteor.userId() && (
              <button
                onClick={handleLike}
                className={`cursor-pointer flex items-center font-bold py-3 px-6 rounded-md transition duration-200 mr-4 mb-4 flex-shrink-0 ${
                  userHasLiked
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <FiHeart className={`mr-2 ${userHasLiked ? 'fill-current' : ''}`} /> {userHasLiked ? 'Unlike' : 'Like'}
              </button>
            )}
            {Meteor.userId() && (
              <button
                onClick={() => setIsCreateSnippetModalOpen(true)}
                className="cursor-pointer flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200 mr-4 mb-4 flex-shrink-0"
              >
                <FiShare2 className="mr-2" /> Share Snippet
              </button>
            )}
            {Meteor.userId() && (
              <button
                onClick={() => setIsAddPlaylistModalOpen(true)}
                className="cursor-pointer flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200 mr-4 mb-4 flex-shrink-0"
              >
                <FiPlus className="mr-2" /> Add to Playlist
              </button>
            )}
            {Meteor.userId() === sound.userId && (
              <div className="flex space-x-4 mb-4">
                <Link
                  to={`/sounds/${soundId}/edit`}
                  className="cursor-pointer flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition duration-200 flex-shrink-0"
                >
                  <FiEdit className="mr-2" /> Edit
                </Link>
                <button
                  onClick={handleRemove}
                  className="cursor-pointer flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 flex-shrink-0"
                >
                  <FiTrash2 className="mr-2" /> Remove
                </button>
              </div>
            )}
          </div>
        </div>
      <AddPlaylistModal
        isOpen={isAddPlaylistModalOpen}
        onRequestClose={() => setIsAddPlaylistModalOpen(false)}
        soundId={soundId}
      />

      <Modal
        isOpen={isCreateSnippetModalOpen}
        onRequestClose={() => setIsCreateSnippetModalOpen(false)}
        contentLabel="Create Audio Snippet"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Audio Snippet</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time (seconds)</label>
              <input
                type="number"
                id="startTime"
                value={snippetStartTime}
                onChange={(e) => setSnippetStartTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time (seconds)</label>
              <input
                type="number"
                id="endTime"
                value={snippetEndTime}
                onChange={(e) => setSnippetEndTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              onClick={handleCreateSnippet}
              className="self-end bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 w-full md:w-auto flex items-center justify-center"
              disabled={isCreatingSnippet}
            >
              {isCreatingSnippet ? (
                <FiLoader className="animate-spin" />
              ) : (
                'Create Snippet'
              )}
            </button>
          </div>
          {snippetUrl && (
            <div className="mt-6">
              <video src={snippetUrl} controls className="w-full rounded-lg shadow-md max-h-[300px]"></video>
              <div className="mt-4 flex space-x-4">
                <a href={snippetUrl} download={`snippet-${sound.title}.mp4`} className="text-blue-500 hover:underline">Download & Share</a>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

        {Meteor.userId() && (
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
              className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Post Comment
            </button>
          </form>
        )}

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-gray-800">
                      <Link to={`/profile/${comment.userSlug}`} className="text-blue-500 hover:underline">
                        {comment.userName}
                      </Link>
                    </p>
                    <span className="ml-4 text-sm text-gray-500">{format(new Date(comment.createdAt), "dd.MM.yyyy - HH:mm")}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                {comment.userId === Meteor.userId() && (
                  <button
                    onClick={() => handleRemoveComment(comment._id)}
                    className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                    title="Remove comment"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <AddPlaylistModal
        isOpen={isAddPlaylistModalOpen}
        onRequestClose={() => setIsAddPlaylistModalOpen(false)}
        soundId={soundId}
      />
    </div>
  );
};

export default Sound;
