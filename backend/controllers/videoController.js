import Video from "../models/videoModel.js";

export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnail, categories, tags } = req.body;

    const newVideo = await Video.create({
      title,
      description,
      thumbnail,
      categories,
      tags,
    });

    return res
      .status(201)
      .json({ message: "Video created", results: newVideo });
  } catch (error) {
    console.log("Error creating video", error.message);
    return res.status(500).json({ message: error.message });
  }
};
