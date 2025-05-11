const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  saveLocation,
  getUserLocation,
  getAllLocations
} = require('../controllers/locationController');

// Save user location
router.post('/', protect, saveLocation);

// Get user's location
router.get('/user', protect, getUserLocation);

// Get all locations (for admin/map view)
router.get('/all', protect, getAllLocations);

module.exports = router; 