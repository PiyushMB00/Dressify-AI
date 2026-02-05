const express = require('express');
const router = express.Router();

// Mock fashion data
const fashionItems = [
  { id: 1, name: 'Casual T-Shirt', category: 'Casual', color: 'Blue', image: 'tshirt.jpg' },
  { id: 2, name: 'Formal Shirt', category: 'Formal', color: 'White', image: 'formal.jpg' },
  { id: 3, name: 'Jeans', category: 'Casual', color: 'Black', image: 'jeans.jpg' },
  { id: 4, name: 'Dress', category: 'Traditional', color: 'Red', image: 'dress.jpg' },
];

// Get all fashion items
router.get('/items', (req, res) => {
  res.json({
    message: 'Fashion items retrieved',
    items: fashionItems
  });
});

// Get items by category
router.get('/items/:category', (req, res) => {
  const { category } = req.params;
  const items = fashionItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
  
  if (items.length === 0) {
    return res.status(404).json({ message: `No items found in category: ${category}` });
  }

  res.json({
    category,
    items
  });
});

// Get recommendations (placeholder for AI recommendations)
router.post('/recommendations', (req, res) => {
  try {
    const { userId, preferences } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Mock AI recommendation logic
    const recommendations = fashionItems.slice(0, 3);

    res.json({
      userId,
      message: 'Recommendations generated',
      recommendations,
      note: 'For advanced AI recommendations, use /api/ai/recommendations endpoint'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
  }
});

module.exports = router;
