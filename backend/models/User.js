// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'nutritionist'], required: true },
  // Nutritionist fields
  specialization: { type: String },
  consultationFee: { type: Number },
  experience: { type: String },
  bio: { type: String },
  profilePicture: { type: String, default: "default_profile.png" },
  ratings: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  // Patient fields
  cancerType: { type: String },
  cancerStage: { type: String },
  currentMedications: { type: [String] },
  dietaryRestrictions: { type: [String] },
  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;