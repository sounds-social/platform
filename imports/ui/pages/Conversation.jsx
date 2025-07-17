import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { HeadProvider, Title } from 'react-head';
import { useTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messages';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef } from 'react';

const ConversationPage = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { messages, otherUser } = useTracker(() => {
    const messagesHandle = Meteor.subscribe('messages');
    const usersHandle = Meteor.subscribe('users.byIds', [userId]);
    const otherUser = Meteor.users.findOne(userId);
    const messages = Messages.find(
      {
        $or: [
          { fromUserId: Meteor.userId(), toUserId: userId },
          { fromUserId: userId, toUserId: Meteor.userId() },
        ],
      },
      { sort: { createdAt: 1 } }
    ).fetch();

    return { messages, otherUser, isLoading: !messagesHandle.ready() || !usersHandle.ready() };
  });

  useEffect(() => {
    Meteor.call('messages.markConversationAsRead', userId);
  }, [userId, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      Meteor.call('messages.send', userId, message, () => {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <HeadProvider>
        <Title>Conversation{otherUser ? ` with ${otherUser.profile.displayName}` : ''} - Sounds Social</Title>
      </HeadProvider>
      {otherUser && <h1 className="text-3xl font-bold text-gray-900">Conversation with <Link to={`/profile/${otherUser.profile.slug}`} className="text-blue-500 hover:underline">{otherUser.profile.displayName}</Link></h1>}
      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 h-96 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg._id} className={`flex ${msg.fromUserId === Meteor.userId() ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`px-4 py-2 rounded-lg ${msg.fromUserId === Meteor.userId() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {msg.message}
                  <p className="text-xs opacity-75 mt-1">{formatDistanceToNow(new Date(msg.createdAt))} ago</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Type a message..."
              />
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm font-medium">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
