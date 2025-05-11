const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")

// Load environment variables
dotenv.config()

// Initialize express
const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React default ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy'],
  crossOriginOpenerPolicy: 'same-origin-allow-popups'
};

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Create uploads directory if it doesn't exist
const fs = require("fs")
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working" })
})

// Connect to database
try {
  const connectDB = require("./config/db")
  connectDB()
  console.log("MongoDB connection initialized")
} catch (error) {
  console.error("Failed to initialize MongoDB connection:", error)
}

// Import routes
try {
  const authRoutes = require("./routes/auth")
  const recipeRoutes = require("./routes/recipeRoutes")
  const userRoutes = require("./routes/userRoutes")
  const nutritionistRoutes = require("./routes/nutritionistRoutes")
  const patientRequestRoutes = require("./routes/patientRequestRoutes")
  const forumRoutes = require("./routes/forumRoutes")
  const messageRoutes = require("./routes/messageRoutes")
  const nutritionAnalysisRoutes = require("./routes/nutritionAnalysisRoutes")
  const subscriptionRoutes = require("./routes/subscriptionRoutes")
  const locationRoutes = require("./routes/locationRoutes")

  // Register routes
  app.use("/api/auth", authRoutes)
  app.use("/api/recipes", recipeRoutes)
  app.use("/api/users", userRoutes)
  app.use("/api/nutritionists", nutritionistRoutes)
  app.use("/api/patients", patientRequestRoutes)
  app.use("/api/forum", forumRoutes)
  app.use("/api/messages", messageRoutes)
  app.use("/api/nutrition", nutritionAnalysisRoutes)
  app.use("/api/subscriptions", subscriptionRoutes)
  app.use("/api/locations", locationRoutes)

  console.log("Routes registered successfully")
} catch (error) {
  console.error("Failed to register routes:", error)
}

// Root route
app.get("/", (req, res) => {
  res.send("AI Recipe Generator API for Cancer Patients")
})

// Catch-all route for debugging 404s
app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    availableEndpoints: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/users/profile",
      "/api/recipes",
      "/api/nutritionists",
      "/api/patients/requests",
      "/api/forum/categories",
      "/api/messages",
      "/api/nutrition/recipes/:id/nutrition",
      "/api/subscriptions",
    ],
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error encountered:", err.stack)
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Test the API at: http://localhost:${PORT}/api/test`)
})

module.exports = app
