const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Please specify a support subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe your issue'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Support', supportSchema);
