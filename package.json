const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please provide license number'],
      unique: true,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    vehicle: {
      type: {
        type: String,
        enum: ['sedan', 'suv', 'economy', 'premium'],
        required: true,
      },
      make: String,
      model: String,
      year: Number,
      licensePlate: {
        type: String,
        unique: true,
        required: true,
      },
      color: String,
    },
    documents: {
      insurance: String,
      registration: String,
      pollutionCertificate: String,
    },
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.2145, 28.5255]
      },
    },
  },
  { timestamps: true }
);

// Create geospatial index for location
driverSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
