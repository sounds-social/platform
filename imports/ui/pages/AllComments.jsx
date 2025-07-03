import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { format } from "date-fns";
import { FiTrash2 } from 'react-icons/fi';
import { Comments } from '../../api/comments';
import { Sounds } from '../../api/sounds';

const AllComments = () => {
  const { slug } = useParams();

  const { comments, loading, user } = useTracker(() => {
    const noDataAvailable = { comments: [], loading: true, user: null };

    const userHandle = Meteor.subscribe('users.view', slug);
    if (!userHandle.ready()) return noDataAvailable;

    const currentUser = Meteor.users.findOne({ 'profile.slug': slug });
    if (!currentUser) return noDataAvailable;

    const commentsHandle = Meteor.subscribe('comments.byUser', currentUser._id);
    const soundsHandle = Meteor.subscribe('sounds.public', currentUser._id); // Subscribe to public sounds for comment context

    if (!commentsHandle.ready() || !soundsHandle.ready()) return noDataAvailable;

    const userComments = Comments.find({ userId: currentUser._id }, { sort: { createdAt: -1 } }).fetch();
    const commentsWithSoundTitle = userComments.map(comment => {
      const sound = Sounds.findOne(comment.soundId);
      return {
        ...comment,
        soundTitle: sound ? sound.title : 'Unknown Sound',
      };
    });

    return { comments: commentsWithSoundTitle, loading: false, user: currentUser };
  }, [slug]);

  const handleRemoveComment = async (commentId) => {
    if (window.confirm('Are you sure you want to remove this comment?')) {
      await Meteor.callAsync('comments.remove', commentId);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">User not found</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Comments by {user.profile.displayName}</h1>
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start">
              <div>
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-gray-500 text-sm mt-2">On sound: <Link to={`/sound/${comment.soundId}`} className="text-blue-500 hover:underline">{comment.soundTitle || 'Unknown Sound'}</Link></p>
                <p className="text-gray-500 text-xs">Created at: {format(new Date(comment.createdAt), "dd.MM.yyyy - HH:mm")}</p>
              </div>
              {comment.userId === Meteor.userId() && (
                <button
                  onClick={() => handleRemoveComment(comment._id)}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 ml-4"
                  title="Remove comment"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No comments made yet.</p>
      )}
    </div>
  );
};

export default AllComments;
