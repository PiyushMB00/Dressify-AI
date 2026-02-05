const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  tags: [String],
  images: [String], // stored as /uploads/filename
  stock: { type: Number, default: 0 },
  metadata: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
