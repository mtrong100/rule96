import Video from "../models/videoModel.js";

export const getVideos = async (req, res) => {
  try {
    const { title, status, category, tag, dateFilter } = req.query;

    const filter = {};

    if (title) filter.title = new RegExp(title, "i");
    if (status) filter.status = status;
    if (category) filter.categories = { $in: [category] };
    if (tag) filter.tags = { $in: [tag] };

    if (dateFilter) {
      const currentDate = new Date();
      let startDate;

      switch (dateFilter) {
        case "latest":
          break;
        case "oldest":
          break;
        case "past-24-hours":
          startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "past-week":
          startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "past-month":
          startDate = new Date(
            currentDate.setMonth(currentDate.getMonth() - 1)
          );
          break;
        case "past-year":
          startDate = new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          );
          break;
        default:
          break;
      }

      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    const sortOption =
      dateFilter === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const videos = await Video.find(filter)
      .populate([
        {
          path: "categories",
          select: "name",
        },
        {
          path: "tags",
          select: "name",
        },
        {
          path: "user",
          select: "username avatar",
        },
      ])
      .sort(sortOption);

    return res.status(200).json({ message: "Videos fetched", results: videos });
  } catch (error) {
    console.log("Error getting videos", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id).populate([
      {
        path: "categories",
        select: "name",
      },
      {
        path: "tags",
        select: "name",
      },
      {
        path: "user",
        select: "username avatar",
      },
    ]);

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
