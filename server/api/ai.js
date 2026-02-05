const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8001';

// Gemini AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Call Python Gemini backend
    const response = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, {
      message: message
    });

    res.status(200).json({
      userId: userId,
      userMessage: message,
      aiReply: response.data.reply,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    // Provide fallback response when Python backend is down
    const fallbackResponse = `I'm Dressify AI! I'd love to help with your fashion questions. Since my advanced AI is temporarily unavailable, here's my advice: ${req.body.message || 'Fashion is about expressing yourself!'} Try different styles and colors to find what makes you feel confident!`;
    res.status(200).json({ 
      userId: req.body.userId,
      userMessage: req.body.message,
      aiReply: fallbackResponse,
      timestamp: new Date(),
      note: 'Using fallback response - Python backend not available'
    });
  }
});

// AI-powered fashion recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, preferences, budget, style, occasion } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({ message: 'User ID and preferences are required' });
    }

    // Build prompt for Gemini
    const prompt = `You are Dressify AI, a fashion recommendation expert. 
    Based on the following preferences, provide 5 fashion recommendations in JSON format:
    - Preferences: ${preferences}
    - Budget: ${budget || 'No budget specified'}
    - Style: ${style || 'Casual'}
    - Occasion: ${occasion || 'Everyday Wear'}
    
    Return ONLY a valid JSON array with this structure:
    [
      {
        "name": "item name",
        "category": "category",
        "description": "brief description",
        "color": "color",
        "price": "price range",
        "why": "why this recommendation"
      }
    ]`;

    // Call Python Gemini backend
    const response = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, {
      message: prompt
    });

    // Parse AI response
    let recommendations = [];
    try {
      // Extract JSON from response
      const jsonMatch = response.data.reply.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      recommendations = [{
        name: 'Recommendation',
        description: response.data.reply,
        category: 'General'
      }];
    }

    res.status(200).json({
      userId: userId,
      preferences: preferences,
      recommendations: recommendations,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    // Provide fallback recommendations when Python backend is down
    const fallbackRecommendations = [
      {
        name: 'Classic White T-Shirt',
        category: 'Casual',
        description: 'A versatile wardrobe staple that pairs with everything',
        color: 'White',
        price: '$20-30',
        why: 'Perfect for casual wear'
      },
      {
        name: 'Blue Denim Jeans',
        category: 'Casual',
        description: 'Timeless and comfortable',
        color: 'Blue',
        price: '$50-70',
        why: 'Goes with any top'
      },
      {
        name: 'Black Blazer',
        category: 'Formal',
        description: 'Perfect for professional and formal occasions',
        color: 'Black',
        price: '$80-120',
        why: 'Instantly elevates any outfit'
      }
    ];
    res.status(200).json({
      userId: req.body.userId,
      preferences: req.body.preferences,
      recommendations: fallbackRecommendations,
      timestamp: new Date(),
      note: 'Using fallback recommendations - Python backend not available'
    });
  }
});

// AI outfit matching
router.post('/outfit-match', async (req, res) => {
  try {
    const { userId, imageUrls, items } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const itemsStr = items ? JSON.stringify(items) : 'No items specified';
    const imagesStr = imageUrls ? imageUrls.join(', ') : 'No images';

    const prompt = `You are Dressify AI, a fashion stylist.
    Analyze these fashion items and images for outfit matching:
    Items: ${itemsStr}
    Image URLs: ${imagesStr}
    
    Provide outfit matching suggestions and styling tips in a conversational format.`;

    // Call Python Gemini backend
    const response = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, {
      message: prompt
    });

    res.status(200).json({
      userId: userId,
      suggestion: response.data.reply,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Outfit match error:', error);
    // Provide fallback response
    const fallbackSuggestion = 'Great outfit choice! The key to a perfect look is balancing colors and styles. Make sure your pieces complement each other. For the items you uploaded, try pairing them with neutral colors and classic accessories to create a timeless ensemble.';
    res.status(200).json({
      userId: req.body.userId,
      suggestion: fallbackSuggestion,
      timestamp: new Date(),
      note: 'Using fallback suggestion - Python backend not available'
    });
  }
});

// Style consultation
router.post('/style-consultation', async (req, res) => {
  try {
    const { userId, bodyType, skinTone, personalStyle, concerns } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const prompt = `You are Dressify AI, a personal style consultant.
    Based on the following profile, provide personalized style advice:
    - Body Type: ${bodyType || 'Not specified'}
    - Skin Tone: ${skinTone || 'Not specified'}
    - Personal Style: ${personalStyle || 'Not specified'}
    - Concerns: ${concerns || 'None'}
    
    Provide 3-5 actionable style tips and product recommendations.`;

    // Call Python Gemini backend
    const response = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, {
      message: prompt
    });

    res.status(200).json({
      userId: userId,
      consultation: response.data.reply,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Style consultation error:', error);
    // Provide fallback consultation
    const fallbackConsultation = `Great question about personal style! Here are some tips:\n\n1. Know Your Body: Choose cuts that flatter your figure\n2. Color Theory: Select colors that complement your skin tone\n3. Confidence: Wear what makes you feel good\n4. Quality: Invest in well-made basics\n5. Accessories: Use them to express personality\n\nRemember, the best style is the one that makes YOU feel confident!`;
    res.status(200).json({
      userId: req.body.userId,
      consultation: fallbackConsultation,
      timestamp: new Date(),
      note: 'Using fallback consultation - Python backend not available'
    });
  }
});

// Health check for Python backend
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_BACKEND_URL}/health`, { timeout: 5000 });
    res.json({
      status: 'connected',
      pythonBackend: response.status === 200 ? 'online' : 'offline'
    });
  } catch (error) {
    res.status(503).json({
      status: 'disconnected',
      pythonBackend: 'offline',
      message: 'Cannot reach Python Gemini backend'
    });
  }
});

module.exports = router;
