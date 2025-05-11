exports.generateAIRecipe = async ({ requestId, ingredients, mealType, texturePreference, customNotes }) => {
    // TODO: Call to AI service to generate recipe
    return {
      id: 'generated-recipe-id',
      title: 'Generated Healthy Meal',
      ingredients,
      instructions: ['Step 1...', 'Step 2...'],
      nutritionalInfo: {
        calories: 300,
        protein: 20,
        carbs: 40,
        fat: 10
      }
    };
  };
  
  exports.saveRecipe = async ({ requestId, title, ingredients, instructions, nutritionalInfo }) => {
    // TODO: Save to database
    return 'saved-recipe-id';
  };
  const Recipe = require("../models/Recipe")
const PatientRequest = require("../models/PatientRequest")

exports.generateAIRecipe = async ({ requestId, ingredients, mealType, texturePreference, customNotes }) => {
  // TODO: Call to AI service to generate recipe
  // This is a placeholder for the AI-generated recipe
  return {
    id: "generated-recipe-id",
    title: "Generated Healthy Meal",
    ingredients,
    instructions: ["Step 1...", "Step 2..."],
    nutritionalInfo: {
      calories: 300,
      protein: 20,
      carbs: 40,
      fat: 10,
    },
  }
}

exports.saveRecipe = async ({ requestId, title, ingredients, instructions, nutritionalInfo }) => {
  try {
    // Find the request to get the patient and nutritionist info
    const request = await PatientRequest.findById(requestId)
    if (!request) {
      throw new Error("Patient request not found")
    }

    // Create the recipe
    const recipe = new Recipe({
      title,
      ingredients: ingredients.map((ing) => {
        return {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          calories: ing.calories || 0,
          protein: ing.protein || 0,
          carbs: ing.carbs || 0,
          fat: ing.fat || 0,
          fiber: ing.fiber || 0,
        }
      }),
      instructions,
      nutritionalInfo,
      createdBy: request.nutritionistId,
      requestId,
      status: "pending",
      mealType: "Dinner", // Default value, should be passed from the request
    })

    await recipe.save()

    // Update the request with the recipe reference
    request.recipe = recipe._id
    await request.save()

    return recipe._id
  } catch (error) {
    throw new Error("Failed to save recipe: " + error.message)
  }
}

exports.approveRecipe = async (recipeId, comments) => {
  try {
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      throw new Error("Recipe not found")
    }

    recipe.status = "approved"
    recipe.approvedDate = new Date()
    // Add comments if needed

    await recipe.save()

    // Update the associated request if needed
    const request = await PatientRequest.findById(recipe.requestId)
    if (request) {
      request.status = "completed"
      await request.save()
    }
  } catch (error) {
    throw new Error("Failed to approve recipe: " + error.message)
  }
}

exports.getRecipeDetails = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId)
      .populate("createdBy", "fullName")
      .populate({
        path: "requestId",
        populate: {
          path: "patientId",
          select: "fullName",
        },
      })

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    return {
      id: recipe._id,
      title: recipe.title,
      request: recipe.requestId
        ? {
            id: recipe.requestId._id,
            patient: {
              id: recipe.requestId.patientId._id,
              fullName: recipe.requestId.patientId.fullName,
            },
          }
        : null,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      nutritionalInfo: recipe.nutritionalInfo,
      createdBy: {
        id: recipe.createdBy._id,
        fullName: recipe.createdBy.fullName,
      },
      approvedDate: recipe.approvedDate,
      status: recipe.status,
      mealType: recipe.mealType,
    }
  } catch (error) {
    throw new Error("Failed to get recipe details: " + error.message)
  }
}

exports.getPatientRecipes = async (patientId) => {
  try {
    // Find all requests for this patient
    const requests = await PatientRequest.find({ patientId }).populate({
      path: "recipe",
      populate: {
        path: "createdBy",
        select: "fullName",
      },
    })

    // Extract recipes from requests
    const recipes = requests
      .filter((req) => req.recipe)
      .map((req) => ({
        id: req.recipe._id,
        title: req.recipe.title,
        nutritionist: {
          id: req.recipe.createdBy._id,
          fullName: req.recipe.createdBy.fullName,
        },
        approvedDate: req.recipe.approvedDate,
        mealType: req.recipe.mealType,
        status: req.recipe.status,
      }))

    return recipes
  } catch (error) {
    throw new Error("Failed to fetch patient recipes: " + error.message)
  }
}

  exports.approveRecipe = async (recipeId, comments) => {
    // TODO: Update recipe status to approved
  };
  
  exports.getRecipeDetails = async (recipeId) => {
    // TODO: Fetch recipe from database
    return {
      id: recipeId,
      title: 'Sample Recipe',
      request: {
        id: 'requestId',
        patient: {
          id: 'patientId',
          fullName: 'John Doe'
        }
      },
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: ['Do this', 'Do that'],
      nutritionalInfo: {
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15
      },
      createdBy: {
        id: 'nutritionistId',
        fullName: 'Jane Smith'
      },
      approvedDate: new Date(),
      status: 'approved'
    };
  };
  
  exports.getPatientRecipes = async (patientId) => {
    // TODO: Fetch all recipes for a patient
    return [
      {
        id: 'recipe1',
        title: 'Chicken Salad',
        nutritionist: {
          id: 'nutritionist1',
          fullName: 'Jane Smith'
        },
        approvedDate: new Date(),
        mealType: 'Lunch'
      }
    ];
  };