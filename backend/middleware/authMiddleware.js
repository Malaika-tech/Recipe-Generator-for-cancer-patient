const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  let token

  // Check if the Authorization header is present and contains "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from the Authorization header
      token = req.headers.authorization.split(" ")[1]

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key")

      // Get user from the decoded token
      const user = await User.findById(decoded.id).select("-password")
      
      if (!user) {
        console.error("User not found in database.")
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        })
      }

      // Set user in request object
      req.user = {
        id: user._id,
        role: user.role,
        ...user.toObject()
      }
      
      next()
    } catch (error) {
      console.error("Authentication error:", error.message)
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
        error: "Authentication failed. Please try again."
      })
    }
  } else {
    console.error("Authorization header is missing or malformed.")
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token" 
    })
  }
}

module.exports = { protect }
