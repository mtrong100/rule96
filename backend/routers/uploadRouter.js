import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video
});

// Route to upload a single image
router.post("/single-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "rule96",
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Route to upload a single video
router.post("/single-video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the video to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "rule96",
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Failed to upload video" });
  }
});

export default router;
