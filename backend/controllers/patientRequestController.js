const PatientRequest = require("../models/PatientRequest")

// 4.1 Submit Request
exports.submitRequest = async (req, res) => {
  try {
    const patientId = req.user._id || req.user.id // Handle both _id and id
    const {
      nutritionistId,
      cancerStage,
      ingredients,
      dietaryRestrictions,
      symptoms,
      preferredMealTiming,
      additionalNotes,
    } = req.body

    // Validate required fields
    if (!nutritionistId || !cancerStage || !ingredients || !dietaryRestrictions || !symptoms || !preferredMealTiming) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: [
          "nutritionistId",
          "cancerStage",
          "ingredients",
          "dietaryRestrictions",
          "symptoms",
          "preferredMealTiming",
        ],
      })
    }

    const newRequest = await PatientRequest.create({
      patientId,
      nutritionistId,
      cancerStage,
      ingredients,
      dietaryRestrictions,
      symptoms,
      preferredMealTiming,
      additionalNotes,
    })

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      requestId: newRequest._id,
    })
  } catch (error) {
    console.error("Error in submitRequest:", error)
    res.status(500).json({ success: false, message: "Failed to submit request", error: error.message })
  }
}

// 4.2 Get All Patient Requests
exports.getPatientRequests = async (req, res) => {
  try {
    const patientId = req.user._id || req.user.id // Handle both _id and id
    const { status } = req.query

    const query = { patientId }
    if (status) {
      query.status = status
    }

    const requests = await PatientRequest.find(query).populate("nutritionistId", "fullName").sort({ submittedDate: -1 })

    const formattedRequests = requests.map((r) => ({
      id: r._id,
      nutritionist: r.nutritionistId
        ? {
            id: r.nutritionistId._id,
            fullName: r.nutritionistId.fullName,
          }
        : null,
      cancerStage: r.cancerStage,
      submittedDate: r.submittedDate,
      status: r.status,
    }))

    res.status(200).json({ requests: formattedRequests })
  } catch (error) {
    console.error("Error in getPatientRequests:", error)
    res.status(500).json({ success: false, message: "Failed to get requests", error: error.message })
  }
}

// 4.3 Get Single Patient Request Details
exports.getPatientRequestDetails = async (req, res) => {
  try {
    const patientId = req.user._id || req.user.id // Handle both _id and id
    const requestId = req.params.id

    const request = await PatientRequest.findOne({ _id: requestId, patientId })
      .populate("nutritionistId", "fullName")
      .populate("recipe")

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" })
    }

    res.status(200).json({
      id: request._id,
      nutritionist: request.nutritionistId
        ? {
            id: request.nutritionistId._id,
            fullName: request.nutritionistId.fullName,
          }
        : null,
      cancerStage: request.cancerStage,
      ingredients: request.ingredients,
      dietaryRestrictions: request.dietaryRestrictions,
      symptoms: request.symptoms,
      preferredMealTiming: request.preferredMealTiming,
      additionalNotes: request.additionalNotes,
      submittedDate: request.submittedDate,
      status: request.status,
      recipe: request.recipe || null,
    })
  } catch (error) {
    console.error("Error in getPatientRequestDetails:", error)
    res.status(500).json({ success: false, message: "Failed to get request details", error: error.message })
  }
}
