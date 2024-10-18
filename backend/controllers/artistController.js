import Artist from "../models/artistModel.js";

export const getArtists = async (req, res) => {
  try {
    const { name, status } = req.query;

    const filter = {};

    if (name) filter.name = name;
    if (status) filter.status = status;

    const artists = await Artist.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "artist",
          as: "videos",
        },
      },
      {
        $addFields: {
          totalVideos: { $size: "$videos" },
        },
      },
      {
        $project: {
          videos: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      message: "Artists fetched",
      results: artists,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createArtist = async (req, res) => {
  try {
    const { name, image } = req.body;

    const uniqueName = await Artist.findOne({ name });

    if (uniqueName) {
      return res.status(400).json({ message: "Artist already exists" });
    }

    const newArtist = await Artist.create({
      name,
      image,
    });

    res.status(201).json({ message: "Artist created", results: newArtist });
  } catch (error) {
    console.log("Error creating artist", error.message);
    return res.status(500).json({ message: error.message });
  }
};
