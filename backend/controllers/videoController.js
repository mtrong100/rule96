import Video from "../models/videoModel.js";

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
