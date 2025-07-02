import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Notifications as NotificationsCollection } from '../../api/notifications';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPage = () => {
  const { notifications, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('notifications');
    const notifications = NotificationsCollection.find({}, { sort: { createdAt: -1 }, limit: 30 }).fetch();

    return { notifications, isLoading: !handle.ready() };
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      Meteor.call('notifications.markAsRead', notification._id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link
              key={notification._id}
              to={notification.link}
              onClick={() => handleNotificationClick(notification)}
              className={`block p-4 mb-4 rounded-md ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`}
            >
              {notification.message}
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.createdAt))} ago
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No notifications found.</div>
        )}
      </div>
    </div>
  );
};
