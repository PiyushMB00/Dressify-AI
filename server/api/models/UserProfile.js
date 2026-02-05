const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  bodyShape: {
    type: String,
    enum: ['Pear', 'Apple', 'Hourglass', 'Rectangle', 'Inverted Triangle', 'Diamond'],
    default: null
  },
  skinTone: {
    type: String,
    enum: ['Fair', 'Light', 'Medium', 'Olive', 'Deep', 'Dark'],
    default: null
  },
  height: {
    type: String,
    default: null // e.g., "5'6\""
  },
  preferences: {
    favoriteColors: [String],
    favoriteStyles: [String],
    avoidedStyles: [String],
    comfort: {
      type: String,
      enum: ['Very comfortable', 'Comfortable', 'Neutral', 'Fitted', 'Very fitted'],
      default: 'Comfortable'
    },
    fabricPreferences: [String] // e.g., ['Cotton', 'Linen', 'Wool']
  },
  budget: {
    monthly: {
      type: String,
      enum: ['Under $50', '$50-$100', '$100-$200', '$200+'],
      default: '$100-$200'
    },
    perItem: {
      type: String,
      enum: ['Under $25', '$25-$50', '$50-$100', '$100+'],
      default: '$25-$50'
    }
  },
  fashionProfile: {
    primaryStyle: {
      type: String,
      enum: ['Casual', 'Formal', 'Business', 'Sporty', 'Bohemian', 'Vintage', 'Minimalist', 'Trendy'],
      default: 'Casual'
    },
    secondaryStyles: [String],
    occasions: [String], // e.g., ['Everyday', 'Work', 'Date night', 'Party', 'Wedding', 'Vacation']
    sustainabilityPriority: {
      type: String,
      enum: ['Very Important', 'Important', 'Neutral', 'Not Important'],
      default: 'Neutral'
    },
    shopingFrequency: {
      type: String,
      enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Rarely'],
      default: 'Monthly'
    }
  },
  wardrobe: {
    essentials: [String], // e.g., ['White T-shirt', 'Blue Jeans', 'Black Blazer']
    itemCount: {
      type: Number,
      default: 0
    },
    favorites: [
      {
        item: String,
        brand: String,
        color: String,
        occasions: [String]
      }
    ]
  },
  allergies: {
    fabricAllergies: [String],
    dyeAllergies: [String]
  },
  profileImage: {
    type: String,
    default: null
  },
  savedRecommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation'
    }
  ],
  uploadedImages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIHubImage'
    }
  ],
  chatHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIChat'
    }
  ],
  stats: {
    totalRecommendations: {
      type: Number,
      default: 0
    },
    totalImagesUploaded: {
      type: Number,
      default: 0
    },
    totalChats: {
      type: Number,
      default: 0
    },
    favoriteStyle: String,
    averageRating: {
      type: Number,
      default: 0
    }
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
UserSchema.index({ userId: 1, createdAt: -1 });
UserSchema.index({ email: 1 });
UserSchema.index({ fashionProfile: 1 });

const UserProfile = mongoose.model('UserProfile', UserSchema);

module.exports = UserProfile;
