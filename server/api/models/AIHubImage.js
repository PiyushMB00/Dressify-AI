const mongoose = require('mongoose');

const aiHubImageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: String,
    filepath: {
      type: String,
      required: true
    },
    filesize: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    analysis: {
      colors: [String],
      clothingType: String,
      style: String,
      occasion: String,
      description: String,
      aiInsights: String
    },
    recommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
      }
    ],
    tags: [String],
    public: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['uploaded', 'analyzed', 'archived', 'deleted'],
      default: 'uploaded'
    },
    analysisPendingAt: Date,
    analyzedAt: Date,
    metadata: {
      uploadSource: String, // web, mobile, api
      browser: String,
      ipAddress: String
    },
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
    collection: 'ai_hub_images'
  }
);

// Index for faster queries
aiHubImageSchema.index({ userId: 1, uploadedAt: -1 });
aiHubImageSchema.index({ status: 1 });
aiHubImageSchema.index({ 'analysis.style': 1 });

module.exports = mongoose.model('AIHubImage', aiHubImageSchema);
