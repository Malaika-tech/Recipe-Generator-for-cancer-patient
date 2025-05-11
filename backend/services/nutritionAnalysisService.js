const Recipe = require("../models/Recipe")

// Get Recipe Nutrition Data
exports.getRecipeNutritionData = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) throw new Error("Recipe not found")

    return {
      calories: recipe.nutritionalInfo.calories,
      macronutrients: {
        protein: recipe.nutritionalInfo.protein,
        carbs: recipe.nutritionalInfo.carbs,
        fat: recipe.nutritionalInfo.fat,
        fiber: recipe.nutritionalInfo.fiber,
      },
      micronutrients: {
        vitamins: recipe.nutritionalInfo.vitamins,
        minerals: recipe.nutritionalInfo.minerals,
      },
      healthBenefits: recipe.nutritionalInfo.healthBenefits,
      breakdown: getIngredientBreakdown(recipe.ingredients),
    }
  } catch (err) {
    throw new Error("Error fetching recipe nutrition data: " + err.message)
  }
}

// Get Ingredient Breakdown for Recipe
const getIngredientBreakdown = (ingredients) => {
  return ingredients.map((ingredient) => ({
    ingredient: ingredient.name,
    calories: ingredient.calories,
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fat: ingredient.fat,
  }))
}

// Simulate Nutrition with Modified Ingredients
exports.simulateNutrition = async (recipeId, newIngredients) => {
  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) throw new Error("Recipe not found")

    // Calculate nutrition based on modified ingredients
    const nutrition = calculateNewNutrition(newIngredients)

    return {
      calories: nutrition.totalCalories,
      macronutrients: {
        protein: nutrition.totalProtein,
        carbs: nutrition.totalCarbs,
        fat: nutrition.totalFat,
        fiber: nutrition.totalFiber,
      },
      micronutrients: {
        vitamins: nutrition.vitamins,
        minerals: nutrition.minerals,
      },
      healthBenefits: nutrition.healthBenefits,
    }
  } catch (err) {
    throw new Error("Error simulating nutrition: " + err.message)
  }
}

// Calculate New Nutrition
const calculateNewNutrition = (ingredients) => {
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalFiber = 0
  const vitamins = { vitaminA: 0, vitaminC: 0, vitaminD: 0 }
  const minerals = { calcium: 0, iron: 0, potassium: 0 }
  const healthBenefits = ["Improved digestion", "Boosted immunity"] // Example health benefits

  ingredients.forEach((ingredient) => {
    totalCalories += ingredient.calories || 0
    totalProtein += ingredient.protein || 0
    totalCarbs += ingredient.carbs || 0
    totalFat += ingredient.fat || 0
    totalFiber += ingredient.fiber || 0

    // Add vitamin and mineral values if they exist
    if (ingredient.vitamins) {
      vitamins.vitaminA += ingredient.vitamins.vitaminA || 0
      vitamins.vitaminC += ingredient.vitamins.vitaminC || 0
      vitamins.vitaminD += ingredient.vitamins.vitaminD || 0
    }

    if (ingredient.minerals) {
      minerals.calcium += ingredient.minerals.calcium || 0
      minerals.iron += ingredient.minerals.iron || 0
      minerals.potassium += ingredient.minerals.potassium || 0
    }
  })

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalFiber,
    vitamins,
    minerals,
    healthBenefits,
  }
}
