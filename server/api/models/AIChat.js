const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    conversationId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        messageId: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString()
        }
      }
    ],
    topic: String, // Fashion advice, styling tips, etc.
    context: {
      selectedStyle: String,
      selectedOccasion: String,
      selectedBudget: String,
      userPreferences: String
    },
    isFavorited: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'closed'],
      default: 'active'
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
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'ai_chats'
  }
);

// Index for faster queries
aiChatSchema.index({ userId: 1, createdAt: -1 });
aiChatSchema.index({ conversationId: 1 });
aiChatSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('AIChat', aiChatSchema);
