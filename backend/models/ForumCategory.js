const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('ForumCategory', forumCategorySchema);