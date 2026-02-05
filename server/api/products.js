const express = require('express');
const router = express.Router();
const Product = require('./models/Product');
const auth = require('./auth');

// List products with optional filters
router.get('/', async (req, res) => {
  try {
    const { q, category, tag, limit = 20, skip = 0 } = req.query;
    const filter = {};
    if (q) filter.$or = [ { name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } } ];
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const products = await Product.find(filter).limit(parseInt(limit)).skip(parseInt(skip)).sort({ createdAt: -1 });
    res.json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to list products', error: error.message });
  }
});

// Suggest products - simple rule-based suggestions by q/category/tag
router.get('/suggest', async (req, res) => {
  try {
    const { q, category, tag, limit = 8 } = req.query;
    const filter = {};
    if (q) filter.$or = [ { name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } } ];
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    // If no filters provided, return most recent popular products
    const products = await Product.find(filter).limit(parseInt(limit)).sort({ createdAt: -1 });
    res.json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get suggestions', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get product', error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    // Use verifyToken if provided
    const tokenMiddleware = auth.verifyToken;
    if (tokenMiddleware) {
      await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin only' });
    }

    const { name, description, price, category, tags = [], images = [], stock = 0, metadata = {} } = req.body;
    if (!name || typeof price === 'undefined') return res.status(400).json({ message: 'Name and price are required' });

    const product = new Product({ name, description, price, category, tags, images, stock, metadata });
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (tokenMiddleware) {
      await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin only' });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const tokenMiddleware = auth.verifyToken;
    if (tokenMiddleware) {
      await new Promise((resolve, reject) => tokenMiddleware(req, res, (err) => err ? reject(err) : resolve()));
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin only' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
