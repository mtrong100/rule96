import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.RULE96) {
    try {
      token = req.cookies.RULE96;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminProtect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.RULE96) {
    try {
      token = req.cookies.RULE96;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      req.user = await User.findById(decoded.userId).select("-password");

      if (req.user.role !== "Admin") {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
