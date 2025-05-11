const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  changePassword,
} = require("../controllers/userController")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir)
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// File filter for documents (PDF, images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter })

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "User routes are working" })
})

// Routes
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.post("/profile/picture", protect, upload.single("image"), uploadProfilePicture)
router.put("/password", protect, changePassword)
router.get("/test", protect, (req, res) => {
  res.json({ message: "Token is valid, user authenticated", user: req.user })
})

// Add document upload route
router.post("/profile/document", protect, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No document uploaded" });
    }
    // Optionally, you can save the document path to the user model or just return the file info
    res.json({
      success: true,
      message: "Document uploaded successfully",
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router
