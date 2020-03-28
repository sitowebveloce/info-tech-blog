const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  id: {
    type: String
  },
  title: {
    type: String
  },
  slug: String,
  text: {
    type: String
  },
  importance: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

// Export
module.exports = mongoose.model("Post", PostSchema);
