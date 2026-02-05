const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  shippingAddress: { type: Object },
  paymentMethod: { type: String, default: 'manual' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  status: { type: String, default: 'processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
