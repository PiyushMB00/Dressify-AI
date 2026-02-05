const express = require('express');
const router = express.Router();
const UserProfile = require('./models/UserProfile');

// Create or update user profile
router.post('/profile', async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      age,
      gender,
      bodyShape,
      skinTone,
      height,
      preferences,
      budget,
      fashionProfile,
      wardrobe,
      allergies,
      profileImage
    } = req.body;

    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, firstName, lastName, email'
      });
    }

    // Check if user exists
    let user = await UserProfile.findOne({ userId });

    if (user) {
      // Update existing user
      user = Object.assign(user, {
        firstName,
        lastName,
        email,
        age,
        gender,
        bodyShape,
        skinTone,
        height,
        preferences: { ...user.preferences, ...preferences },
        budget: { ...user.budget, ...budget },
        fashionProfile: { ...user.fashionProfile, ...fashionProfile },
        wardrobe: { ...user.wardrobe, ...wardrobe },
        allergies: { ...user.allergies, ...allergies },
        profileImage,
        isProfileComplete: true,
        lastActive: new Date()
      });
    } else {
      // Create new user
      user = new UserProfile({
        userId,
        firstName,
        lastName,
        email,
        age,
        gender,
        bodyShape,
        skinTone,
        height,
        preferences: preferences || {},
        budget: budget || {},
        fashionProfile: fashionProfile || {},
        wardrobe: wardrobe || {},
        allergies: allergies || {},
        profileImage,
        isProfileComplete: true
      });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User profile saved successfully',
      userId: user._id,
      user: user
    });
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ userId: req.params.userId })
      .populate('savedRecommendations', 'style occasion recommendations rating')
      .populate('uploadedImages', 'filename filepath createdAt')
      .populate('chatHistory', 'topic messageCount createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all users (admin)
router.get('/all', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const users = await UserProfile.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserProfile.countDocuments();

    res.json({
      success: true,
      total: total,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update user fashion preferences
router.put('/preferences/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update preferences
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    if (req.body.budget) {
      user.budget = { ...user.budget, ...req.body.budget };
    }

    if (req.body.fashionProfile) {
      user.fashionProfile = { ...user.fashionProfile, ...req.body.fashionProfile };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add to saved recommendations
router.post('/save-recommendation/:userId', async (req, res) => {
  try {
    const { recommendationId } = req.body;

    const user = await UserProfile.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.savedRecommendations.includes(recommendationId)) {
      user.savedRecommendations.push(recommendationId);
      user.stats.totalRecommendations = user.savedRecommendations.length;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Recommendation saved',
      totalSaved: user.savedRecommendations.length
    });
  } catch (error) {
    console.error('Error saving recommendation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      stats: {
        userId: user.userId,
        name: `${user.firstName} ${user.lastName}`,
        totalRecommendations: user.stats.totalRecommendations,
        totalImagesUploaded: user.stats.totalImagesUploaded,
        totalChats: user.stats.totalChats,
        favoriteStyle: user.stats.favoriteStyle,
        averageRating: user.stats.averageRating,
        profileComplete: user.isProfileComplete,
        memberSince: user.createdAt,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete user account
router.delete('/profile/:userId', async (req, res) => {
  try {
    const user = await UserProfile.findOneAndDelete({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User profile deleted'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search users by style
router.get('/search/style/:style', async (req, res) => {
  try {
    const users = await UserProfile.find({
      'fashionProfile.primaryStyle': req.params.style
    }).limit(20);

    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
