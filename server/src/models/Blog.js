const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      default: 'News',
    },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // rich text or markdown
    thumbnail: { type: String }, // optional image URL
    readMin: { type: String, default: '5' }, // e.g. "5"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
