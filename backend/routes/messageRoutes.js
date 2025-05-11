const express = require("express")
const { sendMessage, getConversations, getMessages, markAsRead } = require("../controllers/messageController")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Message routes are working" })
})

// POST /api/messages
router.post("/", protect, sendMessage)

// GET /api/messages/conversations
router.get("/conversations", protect, getConversations)

// GET /api/messages/:conversationId
router.get("/:conversationId", protect, getMessages)

// PUT /api/messages/:id/read
router.put("/:id/read", protect, markAsRead)

module.exports = router
