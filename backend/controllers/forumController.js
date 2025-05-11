const ForumCategory = require("../models/ForumCategory")
const ForumPost = require("../models/ForumPost")
const ForumComment = require("../models/ForumComment")

// 8.1 Get Forum Categories
exports.getForumCategories = async (req, res) => {
  const categories = await ForumCategory.find()
  res.json({ categories })
}

// 8.2 Create Forum Post
exports.createForumPost = async (req, res) => {
  const { categoryId, title, content } = req.body
  const post = await ForumPost.create({
    categoryId,
    title,
    content,
    author: req.user.id,
  })
  res.json({
    success: true,
    message: "Post created successfully",
    postId: post._id,
  })
}

// 8.3 Get Forum Posts
exports.getForumPosts = async (req, res) => {
  const { categoryId, page = 1, limit = 10 } = req.query
  const query = categoryId ? { categoryId } : {}

  const posts = await ForumPost.find(query)
    .populate("author", "fullName profilePicture")
    .populate("categoryId", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit))

  const totalCount = await ForumPost.countDocuments(query)

  const postList = posts.map((post) => ({
    id: post._id,
    title: post.title,
    author: post.author,
    category: {
      id: post.categoryId._id,
      name: post.categoryId.name,
    },
    createdAt: post.createdAt,
    commentCount: post.comments.length,
    excerpt: post.content.substring(0, 100),
  }))

  res.json({
    posts: postList,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / limit),
  })
}

// 8.4 Get Forum Post Details
exports.getForumPostDetails = async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
    .populate("author", "fullName profilePicture")
    .populate("categoryId", "name")
    .populate({
      path: "comments",
      populate: { path: "author", select: "fullName profilePicture" },
    })

  res.json({
    id: post._id,
    title: post.title,
    content: post.content,
    author: post.author,
    category: {
      id: post.categoryId._id,
      name: post.categoryId.name,
    },
    createdAt: post.createdAt,
    comments: post.comments,
  })
}

// 8.5 Create Comment on Post
exports.createCommentOnPost = async (req, res) => {
  const { content } = req.body
  const comment = await ForumComment.create({
    postId: req.params.id,
    content,
    author: req.user.id,
  })

  await ForumPost.findByIdAndUpdate(req.params.id, {
    $push: { comments: comment._id },
  })

  res.json({
    success: true,
    message: "Comment added successfully",
    commentId: comment._id,
  })
}

// 8.6 Like/Dislike Post
exports.votePost = async (req, res) => {
  const { vote } = req.body // 1 (like), -1 (dislike), 0 (remove)
  const post = await ForumPost.findById(req.params.id)

  if (!post.votes) post.votes = {} // Initialize if not present
  post.votes[req.user.id] = vote
  await post.save()

  const votes = Object.values(post.votes)
  const likes = votes.filter((v) => v === 1).length
  const dislikes = votes.filter((v) => v === -1).length

  res.json({
    success: true,
    message: "Vote recorded successfully",
    likes,
    dislikes,
  })
}
