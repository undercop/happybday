const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    "https://happybday-front.vercel.app", // ✅ your frontend domain
    "http://localhost:5173"              // for local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Debug Cloudinary Configuration
console.log("🔧 Checking Cloudinary configuration...");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

// ✅ Configure Cloudinary (only if keys exist)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured successfully");
} else {
  console.log("⚠️ Cloudinary configuration missing — fallback to local storage");
}

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/birthday-website";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schema
const memorySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  date: { type: Date, required: true },
  cloudinaryId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Memory = mongoose.model("Memory", memorySchema);

// ✅ Multer (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed!"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ✅ Cloudinary Upload Helper
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "birthday-memories",
        transformation: [{ width: 1200, height: 800, crop: "limit" }, { quality: "auto" }, { format: "jpg" }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });

// ✅ Local Storage Fallback
const saveToLocal = (fileBuffer, originalName) => {
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
  const filename = `local-${Date.now()}-${originalName}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, fileBuffer);
  return {
    secure_url: `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${filename}`,
    public_id: `local-${filename}`,
  };
};

// ✅ Routes
app.get("/api", (req, res) => {
  res.json({
    message: "🎉 Birthday Website API is running!",
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "Configured" : "Not configured",
    storage: process.env.CLOUDINARY_CLOUD_NAME ? "Cloudinary" : "Local",
  });
});

app.get("/api/memories", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch memories" });
  }
});

app.post("/api/memories", async (req, res) => {
  try {
    const { imageUrl, caption, date, cloudinaryId } = req.body;
    const newMemory = new Memory({ imageUrl, caption, date: new Date(date), cloudinaryId });
    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create memory" });
  }
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let result;
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        result = await uploadToCloudinary(req.file.buffer);
      } catch {
        result = saveToLocal(req.file.buffer, req.file.originalname);
      }
    } else {
      result = saveToLocal(req.file.buffer, req.file.originalname);
    }

    res.json({
      message: "File uploaded successfully",
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      storage: result.secure_url.includes("cloudinary") ? "cloudinary" : "local",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/uploads", express.static("uploads"));

// ✅ Serverless Export (for Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;
