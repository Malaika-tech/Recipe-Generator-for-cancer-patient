const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const crypto = require("crypto")

const router = express.Router()

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Auth Route] ${req.method} ${req.url}`)
  next()
})

// Test route to verify auth router is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth router is working" })
})

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // In a real application, you would send an email here with the reset link
    // For now, we'll just return the token
    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// Unified Registration
router.post("/register", async (req, res) => {
  const data = req.body
  const { fullName, email, phone, address, password, role } = data

  // Basic validation
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Full name, email, password, and role are required"
    })
  }

  // Role-specific validation
  if (role === 'nutritionist') {
    if (!data.specialization || !data.consultationFee || !data.experience) {
      return res.status(400).json({
        success: false,
        message: "All nutritionist fields are required"
      })
    }
  } else if (role === 'patient') {
    if (!data.cancerType || !data.cancerStage || !data.currentMedications || !data.dietaryRestrictions) {
      return res.status(400).json({
        success: false,
        message: "All patient fields are required"
      })
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid role"
    })
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      ...data,
      password: hashedPassword,
      profilePicture: data.profilePicture || "default_profile.png",
      ratings: data.ratings || 0,
      reviewCount: data.reviewCount || 0
    })
    await newUser.save()

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    )

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        specialization: newUser.specialization,
        consultationFee: newUser.consultationFee,
        experience: newUser.experience,
        cancerType: newUser.cancerType,
        cancerStage: newUser.cancerStage
      }
    })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
})

// Unified Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    )
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        consultationFee: user.consultationFee,
        experience: user.experience,
        cancerType: user.cancerType,
        cancerStage: user.cancerStage
      }
    })
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
})

// Google OAuth Login/Register
router.post("/google", async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }
    if (!role || !['patient', 'nutritionist'].includes(role)) {
      return res.status(400).json({ success: false, message: "Valid role (patient or nutritionist) is required" });
    }

    // Decode the credential (JWT token from Google)
    const decodedToken = jwt.decode(credential);
    const { email, name, picture } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = new User({
        fullName: name,
        email,
        password: "google_oauth_no_password",
        profilePicture: picture,
        role: role
      });
      await user.save();
    } else if (user.role !== role) {
      // Update role if it's different
      user.role = role;
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

console.log("Auth routes defined")
module.exports = router
