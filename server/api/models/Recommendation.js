const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    preferences: {
      type: String,
      required: true
    },
    budget: {
      type: String,
      enum: ['Under $50', '$50-$100', '$100-$200', '$200+', ''],
      default: ''
    },
    style: {
      type: String,
      enum: ['Casual', 'Formal', 'Business', 'Sporty', 'Bohemian', 'Vintage', 'Minimalist'],
      default: 'Casual'
    },
    occasion: {
      type: String,
      enum: ['Everyday Wear', 'Work', 'Date Night', 'Party', 'Wedding', 'Vacation'],
      default: 'Everyday Wear'
    },
    recommendations: [
      {
        name: String,
        category: String,
        description: String,
        why: String,
        color: String,
        price: String,
        productId: mongoose.Schema.Types.ObjectId,
        imageUrl: String
      }
    ],
    imageUrl: String, // URL of the uploaded image used for recommendation
    aiResponse: String, // The full AI response
    savedImage: {
      filename: String,
      path: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'recommendations'
  }
);

// Index for faster queries
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ style: 1, occasion: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
