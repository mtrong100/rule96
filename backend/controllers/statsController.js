import Artist from "../models/artistModel.js";
import Category from "../models/categoryModel.js";
import Comment from "../models/commentModel.js";
import Tag from "../models/tagModel.js";
import User from "../models/userModel.js";
import Video from "../models/videoModel.js";
import { MONTH_NAMES } from "../utils/constants.js";

export const getCountStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const commentCount = await Comment.countDocuments();
    const videoCount = await Video.find({
      status: "Approved",
    }).countDocuments();
    const artistCount = await Artist.find({
      status: "Active",
    }).countDocuments();
    const categoryCount = await Category.countDocuments({
      status: "Active",
    });
    const tagCount = await Tag.countDocuments({
      status: "Active",
    });

    return res.status(200).json({
      message: "Count stats fetched",
      results: {
        userCount,
        commentCount,
        videoCount,
        artistCount,
        categoryCount,
        tagCount,
      },
    });
  } catch (error) {
    console.log("Error getting count stats", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getVideoStats = async (req, res) => {
  try {
    // Initialize stats for all months from January to December
    const videoStatsByMonthObj = {};
    const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    MONTH_NAMES.forEach((month) => {
      videoStatsByMonthObj[month] = {
        videoCount: 0,
      };
    });

    // Get all videos and comments in a single query
    const videos = await Video.find();
    const comments = await Comment.find({
      video: { $in: videos.map((v) => v._id) },
    });

    // Initialize total counts
    let totalViewCount = 0;
    let totalCommentCount = 0;
    let totalLikeCount = 0;
    let totalDislikeCount = 0;

    for (const video of videos) {
      const month = new Date(video.createdAt).toLocaleString("default", {
        month: "long",
      });

      // Update stats for the month
      if (videoStatsByMonthObj[month]) {
        videoStatsByMonthObj[month].videoCount += 1;
      }

      // Accumulate total counts
      totalViewCount += video.totalViews || 0;
      totalLikeCount += video.likes?.length || 0;
      totalDislikeCount += video.dislikes?.length || 0;
    }

    // Count comments for each video by month and accumulate total comment count
    for (const comment of comments) {
      totalCommentCount += 1;
    }

    // Prepare results for response, ensuring the order matches MONTH_NAMES
    const results = {
      months: MONTH_NAMES,
      videoCount: MONTH_NAMES.map(
        (month) => videoStatsByMonthObj[month].videoCount
      ),
      viewCount: totalViewCount,
      commentCount: totalCommentCount,
      likeCount: totalLikeCount,
      dislikeCount: totalDislikeCount,
    };

    return res.status(200).json({ message: "Video stats fetched", results });
  } catch (error) {
    console.log("Error getting video stats", error.message);
    return res.status(500).json({ message: error.message });
  }
};
