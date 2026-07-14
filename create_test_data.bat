const Driver = require('../models/Driver');
const User = require('../models/User');

// Register as Driver
exports.registerDriver = async (req, res) => {
  try {
    const { licenseNumber, licenseExpiry, vehicle, bankDetails } = req.body;

    // Check if driver already exists
    let driver = await Driver.findOne({ userId: req.userId });

    if (driver) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a driver',
      });
    }

    driver = new Driver({
      userId: req.userId,
      licenseNumber,
      licenseExpiry,
      vehicle,
      bankDetails,
      isVerified: true, // 🟢 Auto-verify for easy local testing/simulator
    });

    await driver.save();
    
    // 🟢 Update the User's role in database to 'driver'
    await User.findByIdAndUpdate(req.userId, { role: 'driver' });
    
    await driver.populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted and verified.',
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Driver Profile
exports.getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId }).populate('userId', 'name email phone');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Driver Location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
    }

    const driver = await Driver.findOneAndUpdate(
      { userId: req.userId },
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated',
      driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Driver Online Status
exports.toggleOnlineStatus = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    driver.isOnline = !driver.isOnline;
    await driver.save();

    res.status(200).json({
      success: true,
      message: `Driver is now ${driver.isOnline ? 'online' : 'offline'}`,
      isOnline: driver.isOnline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nearby drivers
exports.getNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
    }

    const drivers = await Driver.find({
      isOnline: true,
      isVerified: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    }).populate('userId', 'name phone');

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Driver Earnings
exports.getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.userId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    res.status(200).json({
      success: true,
      earnings: {
        totalEarnings: driver.totalEarnings,
        totalRides: driver.totalRides,
        rating: driver.rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
