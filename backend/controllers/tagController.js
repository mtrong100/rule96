import Tag from "../models/tagModel.js";

export const getTags = async (req, res) => {
  try {
    const { name, status } = req.query;

    const filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (status) filter.status = status;

    const tags = await Tag.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "tags",
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

    return res.status(200).json({ message: "Tags fetched", results: tags });
  } catch (error) {
    console.log("Error getting tags", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const uniqueName = await Tag.findOne({ name });

    if (uniqueName) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const newTag = await Tag.create({
      name,
    });
    return res.status(201).json({ message: "Tag created", results: newTag });
  } catch (error) {
    console.log("Error creating tag", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    tag.name = name;
    tag.status = status;

    await tag.save();

    return res.status(200).json({ message: "Tag updated", results: tag });
  } catch (error) {
    console.log("Error updating tag", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json({ message: "Tag deleted" });
  } catch (error) {
    console.log("Error deleting tag", error.message);
    return res.status(500).json({ message: error.message });
  }
};
