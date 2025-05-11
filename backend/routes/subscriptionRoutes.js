const express = require("express")
const { subscribeNutritionist, getPatientSubscriptions } = require("../controllers/subscriptionController")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Subscription routes are working" })
})

// POST subscribe to nutritionist
router.post("/", protect, subscribeNutritionist)

// GET patient's subscriptions
router.get("/", protect, getPatientSubscriptions)

module.exports = router
