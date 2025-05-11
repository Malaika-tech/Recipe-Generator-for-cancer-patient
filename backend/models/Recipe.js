const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: String,
      quantity: String,
      unit: String,
    },
  ],
  instructions: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientRequest",
  },
  approvedDate: Date,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
})

module.exports = mongoose.model("Recipe", recipeSchema)
