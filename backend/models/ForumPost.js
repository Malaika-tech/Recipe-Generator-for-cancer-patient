const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment' }],
  votes: { type: Map, of: Number } // key=userId, value=vote
});

module.exports = mongoose.model('ForumPost', forumPostSchema);