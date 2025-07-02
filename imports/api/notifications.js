import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Notifications = new Mongo.Collection('notifications');

Notifications.schema = new SimpleSchema({
  userId: { type: String },
  isRead: { type: Boolean, defaultValue: false },
  createdAt: {
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
  },
  link: { type: String },
  message: { type: String },
});

Notifications.attachSchema(Notifications.schema);
