const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, default: 'My Avatar' },
    imageUrl: { type: String, default: '' },
    skinTone: { type: String, default: '' },
    bodyType: { type: String, default: '' },
    currentOutfit: {
      top: String,
      bottom: String,
      shoes: String,
      accessories: [String]
    },
    metadata: {
      height: String,
      measurements: Object
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: 'avatars' }
);

avatarSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

avatarSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Avatar', avatarSchema);
