const express = require("express")
const router = express.Router()
const recipeController = require("../controllers/recipeController")
const { protect } = require("../middleware/authMiddleware")

// Generate a recipe
router.post("/generate", protect, recipeController.generateRecipe)

// Save a recipe
router.post("/", protect, recipeController.saveRecipe)

// Approve a recipe
router.put("/:id/approve", protect, recipeController.approveRecipe)

// Get recipe details
router.get("/:id", protect, recipeController.getRecipeDetails)

// Get patient recipes
router.get("/patient/all", protect, recipeController.getPatientRecipes)

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Recipe routes are working" })
})

module.exports = router
