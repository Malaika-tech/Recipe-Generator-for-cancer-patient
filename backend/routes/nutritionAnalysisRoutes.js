const express = require("express")
const router = express.Router()
const nutritionController = require("../controllers/nutritionAnalysisController")

// Get Recipe Nutrition
router.get("/recipes/:id/nutrition", nutritionController.getRecipeNutrition)

// Simulate Nutrition with Modified Ingredients
router.post("/recipes/:id/nutrition/simulate", nutritionController.modifyRecipeIngredients)

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Nutrition analysis routes are working" })
})

module.exports = router
