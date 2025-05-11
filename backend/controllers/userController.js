const User = require("../models/User")
const bcrypt = require("bcryptjs")
const PatientRequest = require("../models/PatientRequest")

// @desc Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user
    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.fullName = req.body.fullName || user.fullName
      user.email = req.body.email || user.email
      user.phone = req.body.phone || user.phone
      user.address = req.body.address || user.address

      await user.save()
      res.json({ success: true, message: "Profile updated successfully" })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    if (user) {
      const filePath = `/uploads/${req.file.filename}`
      user.profilePicture = filePath
      await user.save()
      res.json({
        success: true,
        message: "Profile picture updated successfully",
        imageUrl: filePath,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = await bcrypt.hash(newPassword, 10)
      await user.save()
      res.json({ success: true, message: "Password changed successfully" })
    } else {
      res.status(400).json({ message: "Current password is incorrect" })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all nutritionists (public)
const getAllNutritionists = async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization } = req.query;
    const parsedPage = Number.parseInt(page);
    const parsedLimit = Number.parseInt(limit);
    const filter = { role: 'nutritionist' };
    if (specialization) filter.specialization = specialization;
    const nutritionists = await User.find(filter)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);
    const total = await User.countDocuments(filter);
    res.json({
      nutritionists,
      totalPages: Math.ceil(total / parsedLimit),
      currentPage: parsedPage,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific nutritionist (public)
const getNutritionistById = async (req, res) => {
  try {
    const nutritionist = await User.findOne({ _id: req.params.id, role: 'nutritionist' });
    if (!nutritionist) {
      return res.status(404).json({ error: "Nutritionist not found" });
    }
    res.json(nutritionist);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get nutritionist profile
const getNutritionistProfile = async (req, res) => {
  try {
    const nutritionist = await User.findById(req.user.id).select('-password');
    
    if (!nutritionist) {
      return res.status(404).json({
        success: false,
        message: "Nutritionist not found"
      });
    }

    if (nutritionist.role !== 'nutritionist') {
      return res.status(403).json({
        success: false,
        message: "Access denied. User is not a nutritionist"
      });
    }

    res.status(200).json({
      success: true,
      data: nutritionist
    });
  } catch (error) {
    console.error("Get Nutritionist Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nutritionist profile",
      error: error.message
    });
  }
};

// Get all patient requests for a nutritionist
const getNutritionistRequests = async (req, res) => {
  try {
    const nutritionistId = req.user.id;
    const {
      status,
      search,
      cancerStage,
      symptom,
      dietType,
      sortBy = "submittedDate",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;
    const query = { nutritionistId };
    if (status) query.status = status;
    if (cancerStage) query.cancerStage = cancerStage;
    if (symptom) query.symptoms = { $in: [symptom] };
    if (dietType) query.dietaryRestrictions = dietType;
    const parsedPage = Number.parseInt(page);
    const parsedLimit = Number.parseInt(limit);
    const requests = await PatientRequest.find(query)
      .populate("patientId", "fullName profilePicture")
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);
    const totalCount = await PatientRequest.countDocuments(query);
    res.status(200).json({
      requests,
      totalCount,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get detailed info of a specific patient request
const getNutritionistRequestDetails = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await PatientRequest.findById(requestId).populate("patientId", "fullName profilePicture");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({
      id: request._id,
      patient: request.patientId,
      cancerStage: request.cancerStage,
      ingredients: request.ingredients,
      dietaryRestrictions: request.dietaryRestrictions,
      symptoms: request.symptoms,
      preferredMealTiming: request.preferredMealTiming,
      additionalNotes: request.additionalNotes,
      submittedDate: request.submittedDate,
      status: request.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  changePassword,
  getAllNutritionists,
  getNutritionistById,
  getNutritionistProfile,
  getNutritionistRequests,
  getNutritionistRequestDetails,
}
