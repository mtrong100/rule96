import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendOtpToEmail } from "../utils/nodemailer.js";
import { generateOtpCode, generateTokenAndSetCookie } from "../utils/helper.js";
import Video from "../models/videoModel.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -resetPasswordOtp -resetPasswordExpires"
    );
    return res.status(200).json({ message: "User fetched", results: user });
  } catch (error) {
    console.log("Error getting user details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserVideos = async (req, res) => {
  try {
    const userVideo = await Video.find({
      user: req.params.userId || req.user._id,
    }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Videos fetched", results: userVideo });
  } catch (error) {
    console.log("Error getting user videos", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    const userExisted = await User.findOne({ email });

    if (userExisted)
      return res.status(400).json({ message: "User already existed" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const userData = await User.findById(newUser._id).select(
      "-password -resetPasswordOtp -resetPasswordExpires"
    );

    return res.status(201).json({ message: "User created", results: userData });
  } catch (error) {
    console.log("Error registering user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { userId: user._id };

    generateTokenAndSetCookie(payload, res);

    const userData = await User.findById(user._id).select(
      "-password -resetPasswordOtp -resetPasswordExpires"
    );

    return res
      .status(200)
      .json({ message: "Login successful", results: userData });
  } catch (error) {
    console.log("Error logging in user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("RULE96");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error logging out user", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtpCode();

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOtpToEmail(email, "Your OTP Code for Account Verification", otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("Error sending OTP", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, age, city, country, relationshipStatus, about, avatar } =
      req.body;

    const user = await User.findById(req.user._id);

    user.username = username;
    user.age = age;
    user.city = city;
    user.country = country;
    user.relationshipStatus = relationshipStatus;
    user.about = about;
    user.avatar = avatar;

    await user.save();

    const userData = await User.findById(req.user._id).select(
      -"password -resetPasswordOtp -resetPasswordExpires"
    );

    return res
      .status(200)
      .json({ message: "Profile updated", results: userData });
  } catch (error) {
    console.log("Error updating user profile", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (otp !== user.resetPasswordOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error resetting password", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, avatar, age, city, country, relationshipStatus, about } =
      req.body;

    const user = await User.findById(req.params.id);

    user.username = username;
    user.avatar = avatar;
    user.age = age;
    user.city = city;
    user.country = country;
    user.relationshipStatus = relationshipStatus;
    user.about = about;

    await user.save();

    const userData = await User.findById(req.params.id).select(
      -"password -resetPasswordOtp -resetPasswordExpires"
    );

    return res
      .status(200)
      .json({ message: "Profile updated", results: userData });
  } catch (error) {
    console.log("Error updating user profile", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error.message);
    return res.status(500).json({ message: error.message });
  }
};
