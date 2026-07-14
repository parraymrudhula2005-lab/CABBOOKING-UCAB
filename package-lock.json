const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    pickupLocation: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    dropoffLocation: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    rideType: {
      type: String,
      enum: ['economy', 'premium', 'shared'],
      default: 'economy',
    },
    distance: Number, // in kilometers
    duration: Number, // in minutes
    fare: {
      baseFare: Number,
      perKmRate: Number,
      totalFare: Number,
      discount: {
        type: Number,
        default: 0,
      },
      finalFare: Number,
      paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'wallet'],
        default: 'cash',
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
    rating: {
      driverRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      userRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      driverReview: String,
      userReview: String,
    },
    requestedAt: Date,
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

// Create geospatial indexes
bookingSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
bookingSchema.index({ 'dropoffLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Booking', bookingSchema);
