const express = require("express")
const router = express.Router()
const patientRequestController = require("../controllers/patientRequestController")
const { protect } = require("../middleware/authMiddleware")

// All routes require Authorization token
router.post("/requests", protect, patientRequestController.submitRequest)
router.get("/requests", protect, patientRequestController.getPatientRequests)
router.get("/requests/:id", protect, patientRequestController.getPatientRequestDetails)

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Patient request routes are working" })
})

module.exports = router
