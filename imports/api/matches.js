import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Matches = new Mongo.Collection('matches');

const MatchSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  swipedUserId: {
    type: String,
  },
  action: {
    type: String,
    allowedValues: ['like', 'dislike'],
  },
  createdAt: {
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date()
      }
    },
  },
});

Matches.attachSchema(MatchSchema);
