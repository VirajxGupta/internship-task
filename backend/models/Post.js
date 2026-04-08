const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Post', postSchema);
