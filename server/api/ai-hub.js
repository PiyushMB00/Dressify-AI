const express = require('express');
const axios = require('axios');
const router = express.Router();

// Import MongoDB Models
const Recommendation = require('./models/Recommendation');
const AIChat = require('./models/AIChat');
const AIHubImage = require('./models/AIHubImage');

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8001';

// ============================================
// RECOMMENDATIONS ENDPOINTS
// ============================================

// Get AI Recommendations and Save to Database
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, preferences, budget, style, occasion, imageUrl } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({ message: 'User ID and preferences are required' });
    }

    let recommendations = [];
    let aiReply = '';

    // Try to get AI recommendations from Python backend
    try {
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
      const aiResponse = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, {
        message: prompt
      });

      aiReply = aiResponse.data.reply;

      try {
        const jsonMatch = aiResponse.data.reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        recommendations = [{
          name: 'Fashion Recommendation',
          description: aiResponse.data.reply,
          category: 'General'
        }];
      }
    } catch (aiError) {
      console.warn('AI backend unavailable, using fallback recommendations:', aiError.message);
      
      // Fallback recommendations based on style
      const fallbackRecommendations = {
        'Minimalist': [
          { name: 'Classic White T-Shirt', category: 'Tops', description: 'Essential white tee', color: 'White', price: '$20-40', why: 'Wardrobe staple' },
          { name: 'Black Jeans', category: 'Bottoms', description: 'Slim fit black denim', color: 'Black', price: '$50-80', why: 'Perfect for minimalist style' },
          { name: 'White Sneakers', category: 'Shoes', description: 'Clean white canvas sneakers', color: 'White', price: '$40-70', why: 'Versatile and clean' },
          { name: 'Neutral Cardigan', category: 'Tops', description: 'Beige wool cardigan', color: 'Beige', price: '$60-90', why: 'Layering essential' },
          { name: 'Structured Handbag', category: 'Accessories', description: 'Black leather tote', color: 'Black', price: '$80-150', why: 'Functional accessory' }
        ],
        'Casual': [
          { name: 'Comfortable Jeans', category: 'Bottoms', description: 'Relaxed fit denim', color: 'Blue', price: '$40-70', why: 'Everyday staple' },
          { name: 'Graphic T-Shirt', category: 'Tops', description: 'Fun printed tee', color: 'Various', price: '$15-30', why: 'Express personality' },
          { name: 'Sneakers', category: 'Shoes', description: 'Comfortable casual shoes', color: 'Multiple', price: '$50-100', why: 'All-day comfort' },
          { name: 'Flannel Shirt', category: 'Tops', description: 'Cozy checkered shirt', color: 'Red/Blue', price: '$30-50', why: 'Layering piece' },
          { name: 'Backpack', category: 'Accessories', description: 'Canvas everyday backpack', color: 'Neutral', price: '$40-80', why: 'Practical carry' }
        ],
        'Bohemian': [
          { name: 'Flowy Dress', category: 'Dresses', description: 'Maxi flowing dress', color: 'Earth tones', price: '$50-100', why: 'Boho essential' },
          { name: 'Fringe Jacket', category: 'Tops', description: 'Suede fringe jacket', color: 'Tan', price: '$80-150', why: 'Bohemian style piece' },
          { name: 'Sandals', category: 'Shoes', description: 'Strappy leather sandals', color: 'Brown', price: '$40-70', why: 'Relaxed footwear' },
          { name: 'Vintage Blouse', category: 'Tops', description: 'Embroidered peasant blouse', color: 'Cream/Patterns', price: '$35-60', why: 'Artistic detail' },
          { name: 'Woven Bag', category: 'Accessories', description: 'Straw beach bag', color: 'Natural', price: '$30-60', why: 'Boho accessory' }
        ],
        'Classic': [
          { name: 'Blazer', category: 'Tops', description: 'Structured wool blazer', color: 'Navy/Black', price: '$100-200', why: 'Professional staple' },
          { name: 'White Blouse', category: 'Tops', description: 'Crisp white button-up', color: 'White', price: '$40-80', why: 'Timeless piece' },
          { name: 'Tailored Trousers', category: 'Bottoms', description: 'Dress pants', color: 'Black/Gray', price: '$60-120', why: 'Classic elegance' },
          { name: 'Leather Pumps', category: 'Shoes', description: 'Classic heels', color: 'Black', price: '$80-150', why: 'Polished look' },
          { name: 'Pearl Necklace', category: 'Accessories', description: 'Elegant pearls', color: 'White', price: '$50-200', why: 'Timeless accessory' }
        ]
      };

      recommendations = fallbackRecommendations[style] || fallbackRecommendations['Casual'];
      aiReply = `Generated personalized recommendations for ${style} style, ${occasion}, ${budget} budget.`;
    }

    // Save to MongoDB
    const newRecommendation = new Recommendation({
      userId,
      preferences,
      budget: budget || '',
      style: style || 'Casual',
      occasion: occasion || 'Everyday Wear',
      recommendations,
      imageUrl,
      aiResponse: aiReply,
      status: 'completed'
    });

    await newRecommendation.save();

    res.status(201).json({
      success: true,
      message: 'Recommendations saved successfully',
      recommendationId: newRecommendation._id,
      userId,
      preferences,
      recommendations,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
});

// Get User's Recommendation History
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0, sortBy = 'createdAt' } = req.query;

    const recommendations = await Recommendation.find({ userId })
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Recommendation.countDocuments({ userId });

    res.status(200).json({
      success: true,
      userId,
      total,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// Get Single Recommendation
router.get('/recommendation/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    res.status(200).json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendation',
      error: error.message
    });
  }
});

// Rate Recommendation
router.put('/recommendation/:id/rate', async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { rating, feedback, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Recommendation rated successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error rating recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating recommendation',
      error: error.message
    });
  }
});

// Delete Recommendation
router.delete('/recommendation/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndDelete(req.params.id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recommendation',
      error: error.message
    });
  }
});

// ============================================
// CHAT ENDPOINTS
// ============================================

// Send Chat Message and Save to Database
router.post('/chat', async (req, res) => {
  try {
    const { userId, message, conversationId, provider } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ success: false, message: 'User ID and message are required' });
    }

    let aiReply = '';

    // 1) If provider explicitly requests OpenAI or env key exists, try OpenAI Chat Completions
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (provider === 'OpenAI' || (!provider && OPENAI_KEY)) {
      try {
        const openaiResp = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are Dressify AI, an expert fashion assistant.' },
            { role: 'user', content: message }
          ],
          max_tokens: 400,
          temperature: 0.8
        }, {
          headers: { Authorization: `Bearer ${OPENAI_KEY}` }
        });

        aiReply = openaiResp.data.choices?.[0]?.message?.content?.trim() || '';
      } catch (openaiErr) {
        console.warn('OpenAI request failed:', openaiErr.message);
      }
    }

    // 2) If OpenAI didn't produce a reply, try existing Python Gemini backend
    if (!aiReply) {
      try {
        const aiResponse = await axios.post(`${PYTHON_BACKEND_URL}/gemini-chat`, { message: message }, { timeout: 10000 });
        aiReply = aiResponse.data.reply;
      } catch (pyErr) {
        console.warn('Python Gemini backend failed:', pyErr.message);
      }
    }

    // 3) If still no reply, try Hugging Face simple text-generation if key provided
    const HF_KEY = process.env.HUGGINGFACE_API_KEY || process.env.AVATAR_HF_API_KEY;
    if (!aiReply && HF_KEY) {
      try {
        const model = process.env.HF_CHAT_MODEL || 'gpt2';
        const prompt = `Fashion assistant reply for: ${message}`;
        const hfResp = await axios.post(`https://api-inference.huggingface.co/models/${model}`, { inputs: prompt }, { headers: { Authorization: `Bearer ${HF_KEY}` }, timeout: 10000 });
        const text = hfResp.data?.[0]?.generated_text || (typeof hfResp.data === 'string' ? hfResp.data : '');
        aiReply = text;
      } catch (hfErr) {
        console.warn('Hugging Face inference failed:', hfErr.message);
      }
    }

    // 4) Final fallback message
    if (!aiReply) {
      aiReply = `I'm Dressify AI! I'd love to help with your fashion questions. Try describing the look you want and I'll recommend outfits.`;
    }

    // Find or create conversation
    let chat;
    if (conversationId) {
      chat = await AIChat.findById(conversationId);
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
    } else {
      chat = new AIChat({ userId, conversationId: new require('mongoose').Types.ObjectId().toString(), topic: 'Fashion Advice' });
    }

    // Add user message
    chat.messages.push({ role: 'user', message: message });

    // Add AI response
    chat.messages.push({ role: 'assistant', message: aiReply });

    chat.updatedAt = new Date();
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({ success: true, message: 'Chat message saved', conversationId: chat._id, chatId: chat._id, userMessage: message, aiReply, totalMessages: chat.messages.length, timestamp: new Date() });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Chat processing failed', error: error.message });
  }
});

// Get Chat History
router.get('/chat-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0, status = 'active' } = req.query;

    const chats = await AIChat.find({ userId, status })
      .sort({ lastMessageAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await AIChat.countDocuments({ userId, status });

    res.status(200).json({
      success: true,
      userId,
      total,
      count: chats.length,
      chats
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history',
      error: error.message
    });
  }
});

// Get Single Conversation
router.get('/chat/:conversationId', async (req, res) => {
  try {
    const chat = await AIChat.findById(req.params.conversationId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
});

// Archive Conversation
router.put('/chat/:conversationId/archive', async (req, res) => {
  try {
    const chat = await AIChat.findByIdAndUpdate(
      req.params.conversationId,
      { status: 'archived', updatedAt: new Date() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation archived',
      chat
    });
  } catch (error) {
    console.error('Error archiving conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving conversation',
      error: error.message
    });
  }
});

// Delete Conversation
router.delete('/chat/:conversationId', async (req, res) => {
  try {
    const chat = await AIChat.findByIdAndDelete(req.params.conversationId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: error.message
    });
  }
});

// ============================================
// IMAGE ENDPOINTS
// ============================================

// Save Image Metadata
router.post('/image/metadata', async (req, res) => {
  try {
    const {
      userId,
      filename,
      originalName,
      filepath,
      filesize,
      mimetype,
      analysis,
      tags
    } = req.body;

    if (!userId || !filename) {
      return res.status(400).json({
        success: false,
        message: 'User ID and filename are required'
      });
    }

    const newImage = new AIHubImage({
      userId,
      filename,
      originalName,
      filepath,
      filesize,
      mimetype,
      analysis,
      tags,
      status: 'uploaded'
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: 'Image metadata saved',
      imageId: newImage._id,
      image: newImage
    });
  } catch (error) {
    console.error('Error saving image metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving image metadata',
      error: error.message
    });
  }
});

// Get User's Images
router.get('/images/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0, status = 'uploaded' } = req.query;

    const images = await AIHubImage.find({ userId, status })
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await AIHubImage.countDocuments({ userId, status });

    res.status(200).json({
      success: true,
      userId,
      total,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error.message
    });
  }
});

// Update Image Analysis
router.put('/image/:imageId/analysis', async (req, res) => {
  try {
    const { analysis, status } = req.body;

    const image = await AIHubImage.findByIdAndUpdate(
      req.params.imageId,
      {
        analysis,
        status: status || 'analyzed',
        analyzedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image analysis updated',
      image
    });
  } catch (error) {
    console.error('Error updating image analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating image analysis',
      error: error.message
    });
  }
});

// Delete Image
router.delete('/image/:imageId', async (req, res) => {
  try {
    const image = await AIHubImage.findByIdAndDelete(req.params.imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted',
      image
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

// Get User Statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const totalRecommendations = await Recommendation.countDocuments({ userId });
    const totalChats = await AIChat.countDocuments({ userId });
    const totalImages = await AIHubImage.countDocuments({ userId });

    const averageRating = await Recommendation.aggregate([
      { $match: { userId, rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const recentRecommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const topStyles = await Recommendation.aggregate([
      { $match: { userId } },
      { $group: { _id: '$style', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      userId,
      stats: {
        totalRecommendations,
        totalChats,
        totalImages,
        averageRating: averageRating.length > 0 ? averageRating[0].avgRating : null,
        topStyles,
        recentRecommendations
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// ============================================
// SEARCH ENDPOINTS
// ============================================

// Search Recommendations
router.get('/search/recommendations', async (req, res) => {
  try {
    const { userId, style, occasion, keyword, minRating } = req.query;

    let query = {};
    if (userId) query.userId = userId;
    if (style) query.style = style;
    if (occasion) query.occasion = occasion;
    if (minRating) query.rating = { $gte: parseInt(minRating) };
    if (keyword) {
      query.$or = [
        { preferences: { $regex: keyword, $options: 'i' } },
        { 'recommendations.description': { $regex: keyword, $options: 'i' } }
      ];
    }

    const recommendations = await Recommendation.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Error searching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching recommendations',
      error: error.message
    });
  }
});

module.exports = router;
