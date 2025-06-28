import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Comments = new Mongo.Collection('comments');

const CommentsSchema = new SimpleSchema({
  content: {
    type: String,
  },
  timestamp: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  soundId: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
  },
  lastUpdatedAt: {
    type: Date,
    autoValue: () => new Date(),
  },
  userId: {
    type: String,
  },
});

Comments.attachSchema(CommentsSchema);
