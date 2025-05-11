// Dummy database models or services (replace with actual DB calls)
const RecipeService = require("../services/RecipeService")

exports.generateRecipe = async (req, res) => {
  try {
    const { requestId, ingredients, mealType, texturePreference, customNotes } = req.body
    const recipe = await RecipeService.generateAIRecipe({
      requestId,
      ingredients,
      mealType,
      texturePreference,
      customNotes,
    })

    res.json({
      success: true,
      recipe,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate recipe", error: error.message })
  }
}

exports.saveRecipe = async (req, res) => {
  try {
    const { requestId, title, ingredients, instructions, nutritionalInfo } = req.body
    const recipeId = await RecipeService.saveRecipe({ requestId, title, ingredients, instructions, nutritionalInfo })

    res.json({
      success: true,
      message: "Recipe saved successfully",
      recipeId,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save recipe", error: error.message })
  }
}

exports.approveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id
    const { comments } = req.body
    await RecipeService.approveRecipe(recipeId, comments)

    res.json({
      success: true,
      message: "Recipe approved and sent to patient",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve recipe", error: error.message })
  }
}

exports.getRecipeDetails = async (req, res) => {
  try {
    const recipeId = req.params.id
    const recipe = await RecipeService.getRecipeDetails(recipeId)

    res.json(recipe)
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get recipe details", error: error.message })
  }
}

exports.getPatientRecipes = async (req, res) => {
  try {
    const patientId = req.user.id // assuming patient ID comes from token
    const recipes = await RecipeService.getPatientRecipes(patientId)

    res.json({ recipes })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch patient recipes", error: error.message })
  }
}
