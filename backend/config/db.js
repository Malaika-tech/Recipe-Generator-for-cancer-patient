const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "URI is set" : "URI is not set")

    // Use a fallback URI for testing if the environment variable is not set
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-recipe-generator"

    // Add more detailed connection options
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`)
    console.error(error)
    // Don't exit the process, just log the error
    console.log("Continuing without database connection...")
    return null
  }
}

module.exports = connectDB
