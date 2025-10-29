const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
require('dotenv').config();

const app = express();

// Debug Cloudinary configuration
console.log('🔧 Checking Cloudinary configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Cloudinary Configuration
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.log('❌ Cloudinary configuration incomplete - using local storage fallback');
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/birthday-website';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Memory Model
const memorySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  date: { type: Date, required: true },
  cloudinaryId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Memory = mongoose.model('Memory', memorySchema);

// Configure multer for temporary file storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('📄 File received:', file.originalname, file.mimetype, file.size);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.log('❌ Invalid file type:', file.mimetype);
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'birthday-memories',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'jpg' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload successful:', result.secure_url);
          resolve(result);
        }
      }
    );

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Helper function for local fallback storage
const saveToLocal = (fileBuffer, originalName) => {
  const fs = require('fs');
  const path = require('path');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  const filename = `local-${Date.now()}-${originalName}`;
  const filepath = path.join(uploadsDir, filename);
  
  fs.writeFileSync(filepath, fileBuffer);
  
  return {
    secure_url: `http://localhost:5000/uploads/${filename}`,
    public_id: `local-${filename}`
  };
};

// Routes

// Get all memories
app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (error) {
    console.error('❌ Error fetching memories:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// Create new memory
app.post('/api/memories', async (req, res) => {
  try {
    const { imageUrl, caption, date, cloudinaryId } = req.body;
    
    const newMemory = new Memory({
      imageUrl,
      caption,
      date: new Date(date),
      cloudinaryId
    });

    await newMemory.save();
    console.log('✅ Memory saved to MongoDB');
    res.status(201).json(newMemory);
  } catch (error) {
    console.error('❌ Error creating memory:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('📨 Upload request received');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let uploadResult;
    
    // Try Cloudinary first
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      console.log('☁️ Attempting Cloudinary upload...');
      try {
        uploadResult = await uploadToCloudinary(req.file.buffer);
        console.log('✅ Cloudinary upload successful');
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary failed, using local storage:', cloudinaryError.message);
        uploadResult = saveToLocal(req.file.buffer, req.file.originalname);
      }
    } else {
      console.log('📁 Cloudinary not configured, using local storage');
      uploadResult = saveToLocal(req.file.buffer, req.file.originalname);
    }

    res.json({
      message: 'File uploaded successfully',
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      storage: uploadResult.secure_url.includes('cloudinary') ? 'cloudinary' : 'local'
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// Serve local uploads
app.use('/uploads', express.static('uploads'));

// Test Cloudinary connection
app.get('/api/test-cloudinary', async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.json({ 
        status: 'not_configured',
        message: 'Cloudinary environment variables not set' 
      });
    }

    // Try to list folders to test connection
    const result = await cloudinary.api.root_folders();
    res.json({ 
      status: 'connected',
      message: 'Cloudinary is working!',
      folders: result.folders
    });
  } catch (error) {
    res.json({ 
      status: 'error',
      message: 'Cloudinary test failed: ' + error.message 
    });
  }
});

// Test route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Birthday Website API is running!',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
    storage: process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Local'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Enabled' : 'Disabled'}`);
});