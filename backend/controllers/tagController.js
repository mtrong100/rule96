import Tag from "../models/tagModel.js";

export const getTags = async (req, res) => {
  try {
    const { name, status } = req.query;

    const filter = {};

    if (name) filter.name = name;
    if (status) filter.status = status;

    const tags = await Tag.find(filter);
    return res.status(200).json({ message: "Tags fetched", results: tags });
  } catch (error) {
    console.log("Error getting tags", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name, status } = req.body;

    const uniqueName = await Tag.findOne({ name });

    if (uniqueName) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const newTag = await Tag.create({
      name,
      status,
    });
    return res.status(201).json({ message: "Tag created", results: newTag });
  } catch (error) {
    console.log("Error creating tag", error.message);
    return res.status(500).json({ message: error.message });
  }
};
