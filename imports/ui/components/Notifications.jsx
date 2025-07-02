import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Notifications as NotificationsCollection } from '../../api/notifications';
import { Link } from 'react-router-dom';
import { IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { unreadCount, notifications } = useTracker(() => {
    const handle = Meteor.subscribe('notifications');
    const notifications = NotificationsCollection.find({ isRead: false }, { sort: { createdAt: -1 }, limit: 5 }).fetch();
    const unreadCount = NotificationsCollection.find({ isRead: false }).count();

    return { unreadCount, notifications, isLoading: !handle.ready() };
  });

  const handleNotificationClick = (notification) => {
    Meteor.call('notifications.markAsRead', notification._id);
    setIsOpen(false);
  };

  return (
    <div className="relative h-[24px]">
      <button onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer">
        {isOpen ? <IoNotifications className="h-6 w-6" /> : <IoNotificationsOutline className="h-6 w-6" />}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  to={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {notification.message}
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt))} ago
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No unread notifications</div>
            )}
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
            >
              Show all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
