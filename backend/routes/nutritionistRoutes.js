const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  getAllNutritionists,
  getNutritionistById,
  getNutritionistProfile,
  getNutritionistRequests,
  getNutritionistRequestDetails
} = require("../controllers/userController") // Assuming these are now in userController.js

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Nutritionist routes are working" })
})

// GET nutritionist profile (requires authentication)
router.get("/profile", protect, getNutritionistProfile)

// GET all requests for nutritionists (requires authentication)
router.get("/requests", protect, getNutritionistRequests)

// GET details of a specific nutritionist request (requires authentication)
router.get("/requests/:id", protect, getNutritionistRequestDetails)

// GET all nutritionists (public)
router.get("/", getAllNutritionists)

// GET a specific nutritionist (public)
router.get("/:id", getNutritionistById)

module.exports = router
