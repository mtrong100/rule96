import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImagesCloudinary = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "rule96",
    });
    return result;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary");
  }
};
