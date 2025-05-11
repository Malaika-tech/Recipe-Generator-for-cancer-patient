const mongoose = require("mongoose")

const patientRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Patient is a User
    required: true,
  },
  nutritionistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Nutritionist is also a User
    required: true,
  },
  cancerStage: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  dietaryRestrictions: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  preferredMealTiming: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
  },
  submittedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
})

module.exports = mongoose.model("PatientRequest", patientRequestSchema)
