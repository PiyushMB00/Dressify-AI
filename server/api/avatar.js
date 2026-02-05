const express = require('express');
const axios = require('axios');
const router = express.Router();

// Models
const Avatar = require('./models/Avatar');

// Create or update avatar for a user (upsert)
router.post('/', async (req, res) => {
  try {
    const { userId, name, imageUrl, skinTone, bodyType, currentOutfit, metadata } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const update = {
      name: name || 'My Avatar',
      imageUrl: imageUrl || '',
      skinTone: skinTone || '',
      bodyType: bodyType || '',
      currentOutfit: currentOutfit || {},
      metadata: metadata || {},
      updatedAt: new Date()
    };

    const avatar = await Avatar.findOneAndUpdate({ userId }, update, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.status(200).json({ success: true, avatar });
  } catch (err) {
    console.error('Create/Update avatar error:', err);
    res.status(500).json({ success: false, message: 'Failed to save avatar', error: err.message });
  }
});

// Get avatar by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const avatar = await Avatar.findOne({ userId });
    if (!avatar) return res.status(404).json({ success: false, message: 'Avatar not found' });
    res.json({ success: true, avatar });
  } catch (err) {
    console.error('Get avatar error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update avatar by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    update.updatedAt = new Date();
    const avatar = await Avatar.findByIdAndUpdate(id, update, { new: true });
    if (!avatar) return res.status(404).json({ success: false, message: 'Avatar not found' });
    res.json({ success: true, avatar });
  } catch (err) {
    console.error('Update avatar error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete avatar by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Avatar.findByIdAndDelete(id);
    res.json({ success: true, message: 'Avatar deleted' });
  } catch (err) {
    console.error('Delete avatar error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Simple avatar suggestion endpoint
// Tries Hugging Face Inference API if AVATAR_HF_API_KEY is set, otherwise uses deterministic fallback
router.post('/suggest', async (req, res) => {
  try {
    const { userId, skinTone, style, occasion, bodyShape } = req.body;

    if (!skinTone && !userId) {
      return res.status(400).json({ success: false, message: 'skinTone or userId is required' });
    }

    const tone = (skinTone || '').toString();
    let suggestions = [];
    let source = 'fallback';

    // If user provided a Hugging Face API key in env, try the inference API
    const HF_KEY = process.env.AVATAR_HF_API_KEY;
    const HF_MODEL = process.env.AVATAR_HF_MODEL || 'gpt2';

    if (HF_KEY) {
      try {
        const prompt = `Suggest 5 dress recommendations (name, category, color, priceRange, why) tailored for skin tone: ${tone}. Style: ${style || 'any'}. Occasion: ${occasion || 'any'}. Keep response as a JSON array.`;

        const hfResp = await axios.post(`https://api-inference.huggingface.co/models/${HF_MODEL}`, { inputs: prompt }, {
          headers: { Authorization: `Bearer ${HF_KEY}` },
          timeout: 15000
        });

        const text = (hfResp.data && (hfResp.data[0]?.generated_text || hfResp.data[0]?.summary_text || hfResp.data)) || '';
        // Try extract JSON
        const match = JSON.stringify(text).match(/\[[\s\S]*\]/);
        if (match) {
          suggestions = JSON.parse(match[0]);
        } else if (typeof text === 'string') {
          // Try to parse raw text if it starts with [
          const start = text.indexOf('[');
          if (start !== -1) {
            try {
              suggestions = JSON.parse(text.slice(start));
            } catch (e) {
              // ignore
            }
          }
        }

        if (suggestions && suggestions.length) source = 'huggingface';
      } catch (e) {
        console.warn('Hugging Face inference failed, falling back:', e.message);
      }
    }

    // Fallback deterministic mapping
    if (!suggestions || suggestions.length === 0) {
      const palettes = {
        'Fair': ['Pastel Blue', 'Soft Pink', 'Ivory', 'Lavender', 'Mint'],
        'Light': ['Peach', 'Coral', 'Cream', 'Sky Blue', 'Soft Yellow'],
        'Medium': ['Teal', 'Warm Red', 'Mustard', 'Olive', 'Plum'],
        'Olive': ['Terracotta', 'Emerald', 'Beige', 'Burnt Orange', 'Navy'],
        'Tan': ['Rust', 'Olive', 'Cobalt', 'Camel', 'Eggplant'],
        'Brown': ['Deep Red', 'Gold', 'Burgundy', 'Forest Green', 'Chocolate'],
        'Dark': ['Vibrant Fuchsia', 'Royal Blue', 'Emerald', 'Bright Yellow', 'Citrine']
      };

      const chosen = palettes[tone] || palettes['Medium'];
      suggestions = [
        { name: `${chosen[0]} Slip Dress`, category: 'Dresses', color: chosen[0], price: '$40-80', why: `Complementary contrast for ${tone} skin tones` },
        { name: `${chosen[1]} Wrap Dress`, category: 'Dresses', color: chosen[1], price: '$60-120', why: 'Flattering silhouette for many body shapes' },
        { name: `${chosen[2]} Midi Dress`, category: 'Dresses', color: chosen[2], price: '$50-100', why: 'Neutral tone that balances skin undertones' },
        { name: `${chosen[3]} Fit & Flare`, category: 'Dresses', color: chosen[3], price: '$70-140', why: 'Nice for both casual and semi-formal occasions' },
        { name: `${chosen[4]} Statement Dress`, category: 'Dresses', color: chosen[4], price: '$90-200', why: 'Makes a bold, confident look' }
      ];
      source = 'fallback';
    }

    res.status(200).json({ success: true, source, suggestions, userId });
  } catch (err) {
    console.error('Avatar suggest error:', err);
    res.status(500).json({ success: false, message: 'Avatar suggestion failed', error: err.message });
  }
});

module.exports = router;
