import Video from "../models/videoModel.js";
import Favorite from "../models/favoriteModel.js";

export const getVideos = async (req, res) => {
  try {
    const { title, status, category, tag } = req.query;

    const filter = {};

    if (title) filter.title = new RegExp(title, "i");
    if (status) filter.status = status;
    if (category) filter.categories = { $in: [category] };
    if (tag) filter.tags = { $in: [tag] };

    const videos = await Video.find(filter)
      .populate("categories", "name")
      .populate("tags", "name");

    return res.status(200).json({ message: "Videos fetched", results: videos });
  } catch (error) {
    console.log("Error getting videos", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate("categories", "name")
      .populate("tags", "name");

    const formatResults = {
      ...video._doc,
      totalLikes: video.likes.length,
      totalDislikes: video.dislikes.length,
    };

    return res
      .status(200)
      .json({ message: "Video details fetched", results: formatResults });
  } catch (error) {
    console.log("Error getting video details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnail, categories, tags, video } = req.body;

    const newVideo = await Video.create({
      title,
      description,
      thumbnail,
      categories,
      tags,
      video,
    });

    return res
      .status(201)
      .json({ message: "Video created", results: newVideo });
  } catch (error) {
    console.log("Error creating video", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const increaseViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.totalViews += 1;

    await video.save();

    return res.status(200).json({ message: "Video viewed successfully" });
  } catch (error) {
    console.log("Error increasing view count", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.user._id;

    if (video.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    } else {
      video.likes.push(userId);

      await video.save();

      return res.status(200).json({ message: "Video liked successfully" });
    }
  } catch (error) {
    console.log("Error liking video", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.user._id;

    if (!video.likes.includes(userId)) {
      return res.status(400).json({ message: "Not liked yet" });
    } else {
      video.likes = video.likes.filter((like) => like.toString() !== userId);

      await video.save();

      return res.status(200).json({ message: "Video disliked successfully" });
    }
  } catch (error) {
    console.log("Error disliking video", error.message);
    return res.status(500).json({ message: error.message });
  }
};
