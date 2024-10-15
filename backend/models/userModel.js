import mongoose from "mongoose";
import { PROFILE_PICTURE } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    age: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    relationshipStatus: {
      type: String,
    },
    about: {
      type: String,
    },
    avatar: {
      type: String,
      required: true,
      default: PROFILE_PICTURE,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
