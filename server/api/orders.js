const express = require('express');
const router = express.Router();
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');
const auth = require('./auth');

// Create an order (authenticated users)
router.post('/create', async (req, res) => {
  try {
    // verify token
    const tokenMiddleware = auth.verifyToken;
    if (!tokenMiddleware) return res.status(500).json({ message: 'Auth middleware not available' });
    await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));

    const { items = [], shippingAddress = {}, paymentMethod = 'manual' } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    // Build order items and calculate total
    let total = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ message: `Product not found: ${it.productId}` });
      const qty = parseInt(it.quantity || 1);
      const price = product.price;
      total += price * qty;
      orderItems.push({ productId: product._id, name: product.name, price, quantity: qty, image: product.images?.[0] });
    }

    const order = new Order({ user: req.user.id, items: orderItems, total, shippingAddress, paymentMethod, paymentStatus: 'pending' });
    await order.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Mark order as paid (simple endpoint for demo/payments)
router.post('/:id/pay', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (!tokenMiddleware) return res.status(500).json({ message: 'Auth middleware not available' });
    await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Allow admin or order owner
    if (!req.user.isAdmin && order.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();
    res.json({ message: 'Payment recorded', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment', error: error.message });
  }
});

// Get orders (admin: all, user: own)
router.get('/', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (!tokenMiddleware) return res.status(500).json({ message: 'Auth middleware not available' });
    await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));

    if (req.user.isAdmin) {
      const orders = await Order.find().populate('user', 'fullname email').sort({ createdAt: -1 });
      return res.json({ count: orders.length, orders });
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
});

// Get order by id (admin or owner)
router.get('/:id', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (!tokenMiddleware) return res.status(500).json({ message: 'Auth middleware not available' });
    await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));

    const order = await Order.findById(req.params.id).populate('user', 'fullname email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (!tokenMiddleware) return res.status(500).json({ message: 'Auth middleware not available' });
    await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));

    // Only admin can update order status
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Only admin can update order status' });

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

module.exports = router;
