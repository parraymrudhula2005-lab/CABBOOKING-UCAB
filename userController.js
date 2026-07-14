const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Payment = require('../models/Payment');

// Request a ride
exports.requestRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, rideType } = req.body;

    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide pickup and dropoff locations',
      });
    }

    // Calculate distance and fare
    const distance = parseFloat((3 + Math.random() * 12).toFixed(1)); // 3 to 15 km
    const rates = { economy: 10, premium: 15, shared: 7 };
    const rate = rates[rideType] || 10;
    const baseFare = 50;
    const totalFare = Math.round(baseFare + (distance * rate));

    const booking = new Booking({
      userId: req.userId,
      pickupLocation,
      dropoffLocation,
      rideType: rideType || 'economy',
      distance,
      fare: {
        baseFare,
        perKmRate: rate,
        totalFare,
        finalFare: totalFare,
        isPaid: false,
      },
      status: 'requested',
      requestedAt: new Date(),
    });

    await booking.save();
    await booking.populate('userId', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept ride (Driver)
exports.acceptRide = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'This ride is no longer available',
      });
    }

    const driver = await Driver.findOne({ userId: req.userId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    booking.driverId = driver._id;
    booking.status = 'accepted';
    booking.acceptedAt = new Date();

    await booking.save();
    await booking.populate([
      { path: 'userId', select: 'name phone email address' },
      { path: 'driverId', populate: { path: 'userId', select: 'name phone' } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Ride accepted successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get booking details
exports.getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate([
      { path: 'userId', select: 'name phone email' },
      { path: 'driverId', populate: { path: 'userId', select: 'name phone' } },
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ['accepted', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = status;

    if (status === 'on_the_way') booking.startedAt = new Date();
    if (status === 'completed') booking.completedAt = new Date();
    if (status === 'cancelled') booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Ride status updated to ${status}`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate({ path: 'driverId', populate: { path: 'userId', select: 'name phone' } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete ride with rating
exports.completeRide = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { driverRating, driverReview } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.rating = {
      userRating: driverRating,
      userReview: driverReview,
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Ride completed and rated',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all unassigned requested bookings
exports.getAvailableBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'requested' })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get driver bookings
exports.getDriverBookings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    const bookings = await Booking.find({ driverId: driver._id })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Process payment for ride
exports.payForRide = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (!booking.fare) {
      booking.fare = {
        baseFare: 50,
        perKmRate: 10,
        totalFare: 120,
        finalFare: 120
      };
    }
    
    booking.fare.isPaid = true;
    booking.fare.paymentMethod = paymentMethod || 'wallet';

    await booking.save();

    // 🟢 Create a corresponding Payment record
    const transactionId = 'TXN' + Date.now() + Math.floor(1000 + Math.random() * 9000);
    const payment = new Payment({
      bookingId: booking._id,
      userId: booking.userId,
      amount: booking.fare.finalFare || 120,
      paymentMethod: paymentMethod || 'phonepe',
      transactionId,
      status: 'success',
    });
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      booking,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
