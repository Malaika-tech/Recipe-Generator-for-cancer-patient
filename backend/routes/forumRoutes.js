const express = require("express")
const router = express.Router()
const forumController = require("../controllers/forumController")
const { protect } = require("../middleware/authMiddleware")

// Test route to verify this router is working
router.get("/test", (req, res) => {
  res.json({ message: "Forum routes are working" })
})

// Forum Categories
router.get("/categories", forumController.getForumCategories)

// Forum Posts
router.post("/posts", protect, forumController.createForumPost)
router.get("/posts", forumController.getForumPosts)
router.get("/posts/:id", forumController.getForumPostDetails)

// Comments
router.post("/posts/:id/comments", protect, forumController.createCommentOnPost)

// Voting
router.post("/posts/:id/vote", protect, forumController.votePost)

module.exports = router
