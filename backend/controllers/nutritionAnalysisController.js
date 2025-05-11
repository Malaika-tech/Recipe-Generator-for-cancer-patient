const { getRecipeNutritionData, simulateNutrition } = require("../services/nutritionAnalysisService")

// Get Recipe Nutrition
exports.getRecipeNutrition = async (req, res) => {
  try {
    const recipeId = req.params.id
    const recipeNutrition = await getRecipeNutritionData(recipeId)
    return res.status(200).json(recipeNutrition)
  } catch (err) {
    console.error("Error fetching recipe nutrition: ", err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

// Modify Recipe Ingredients for Nutrition Simulation
exports.modifyRecipeIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body
    const recipeId = req.params.id
    const modifiedNutrition = await simulateNutrition(recipeId, ingredients)
    return res.status(200).json(modifiedNutrition)
  } catch (err) {
    console.error("Error modifying recipe ingredients: ", err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
