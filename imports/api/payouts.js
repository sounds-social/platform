import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Payouts = new Mongo.Collection('payouts');

const PayoutSchema = new SimpleSchema({
  fromUserId: {
    type: String,
    label: "User who initiated the support (PRO user)",
  },
  toUserId: {
    type: String,
    label: "User receiving the payout (supported musician)",
  },
  amountInCents: {
    type: Number,
    label: "Amount to be paid out in cents",
    min: 0,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
    label: "Timestamp of payout creation",
  },
  isProcessed: {
    type: Boolean,
    defaultValue: false,
    label: "Whether the payout has been processed",
  },
  processedAt: {
    type: Date,
    optional: true,
    label: "Timestamp of payout processing",
  },
  stripeTransferId: {
    type: String,
    optional: true,
    label: "Stripe Transfer ID if processed",
  },
  status: {
    type: String,
    defaultValue: 'pending',
    allowedValues: ['pending', 'transferred', 'failed'],
    label: "Status of the payout",
  },
  failureReason: {
    type: String,
    optional: true,
    label: "Reason for payout failure",
  },
});

Payouts.attachSchema(PayoutSchema);
