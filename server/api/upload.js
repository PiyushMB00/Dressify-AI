const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Analyze image for clothing (mock AI analysis)
router.post('/analyze', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Mock image analysis
    const analysis = {
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      detectedClothing: [
        { type: 'shirt', color: 'blue', confidence: 0.92 },
        { type: 'jeans', color: 'dark blue', confidence: 0.88 },
        { type: 'shoes', color: 'white', confidence: 0.85 }
      ],
      skinTone: 'warm',
      bodyType: 'athletic',
      recommendations: [
        'Complements well with earthy tones',
        'Fits athletic body type perfectly',
        'Great for casual office wear'
      ]
    };

    res.status(200).json({
      message: 'Image analyzed successfully',
      analysis: analysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
});

// Upload single image route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      imageUrl: imageUrl,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      imageUrl: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    }));

    res.status(200).json({
      message: 'Images uploaded successfully',
      count: req.files.length,
      files: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Get image info
router.get('/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const stats = fs.statSync(filepath);
    res.json({
      filename: filename,
      size: stats.size,
      uploadedAt: stats.birthtime,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving image info', error: error.message });
  }
});

// List all uploaded images
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    const imageList = imageFiles.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      uploadedAt: fs.statSync(path.join(uploadsDir, file)).birthtime
    }));

    res.json({
      message: 'Images retrieved successfully',
      count: imageList.length,
      images: imageList
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving images', error: error.message });
  }
});

// Delete image
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    fs.unlinkSync(filepath);
    res.json({ message: 'Image deleted successfully', filename: filename });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

module.exports = router;
