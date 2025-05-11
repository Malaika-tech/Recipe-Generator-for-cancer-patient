const Location = require('../models/Location');

// Save user location
exports.saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const userId = req.user.id;

    const location = new Location({
      userId,
      latitude,
      longitude,
      address
    });

    await location.save();

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving location',
      error: error.message
    });
  }
};

// Get user's location
exports.getUserLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const location = await Location.findOne({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location',
      error: error.message
    });
  }
};

// Get all locations (for admin/map view)
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate('userId', 'fullName email');

    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
}; 