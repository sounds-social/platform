import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Feedback = new Mongo.Collection('feedback');

const FeedbackSchema = new SimpleSchema({
  soundId: {
    type: String,
  },
  giverId: {
    type: String,
  },
  content: {
    type: String,
    min: 50,
    max: 1000,
  },
  rating: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
});

Feedback.attachSchema(FeedbackSchema);
