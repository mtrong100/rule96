import Tag from "../models/tagModel.js";

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
