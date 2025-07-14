import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messages';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const MessagesPage = () => {
  const { messages, users } = useTracker(() => {
    const messagesHandle = Meteor.subscribe('messages');
    const usersHandle = Meteor.subscribe('users.public');
    const messages = Messages.find({}, { sort: { createdAt: -1 } }).fetch();
    const userIds = [...new Set(messages.map(m => m.fromUserId === Meteor.userId() ? m.toUserId : m.fromUserId))];
    const usersWithLastMessage = userIds.map(id => {
      const user = Meteor.users.findOne(id);
      if (!user) return null; // Ensure user is not undefined
      const lastMessage = Messages.findOne(
        {
          $or: [
            { fromUserId: Meteor.userId(), toUserId: id },
            { fromUserId: id, toUserId: Meteor.userId() },
          ],
        },
        { sort: { createdAt: -1 } }
      );
      const unreadCount = Messages.find({ fromUserId: id, toUserId: Meteor.userId(), isRead: false }).count();
      return { ...user, lastMessage, unreadCount };
    }).filter(user => user && user.lastMessage).sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

    return { messages, users: usersWithLastMessage, isLoading: !messagesHandle.ready() || !usersHandle.ready() };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      <div className="mt-8">
        <ul className="">
          {users.length > 0 ? users.map(user => (
            <li key={user._id} className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/messages/${user._id}`} className="block hover:bg-gray-50">
                <div className="flex items-center py-4 px-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      {user?.profile?.avatar ? (
                        <img className="h-12 w-12 rounded-full" src={user.profile.avatar} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                          {user?.profile?.displayName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">{user.profile.displayName}</p>
                        {user.lastMessage && (
                          <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(user.lastMessage.createdAt))} ago</p>
                        )}
                      </div>
                      {user.unreadCount > 0 && (
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Unread
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          )) : (
            <p className="text-center py-8 text-gray-500">No messages found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessagesPage;
