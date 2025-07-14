import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Messages = new Mongo.Collection('messages');

Messages.schema = new SimpleSchema({
  fromUserId: { type: String },
  toUserId: { type: String },
  message: { type: String },
  isRead: { type: Boolean, defaultValue: false },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
});

Messages.attachSchema(Messages.schema);
