import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const uniqueName = await Category.findOne({ name });

    if (uniqueName) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = Category.create({
      name,
      image,
    });

    return res
      .status(201)
      .json({ message: "Category created", results: newCategory });
  } catch (error) {
    console.log("Error creating category", error.message);
    return res.status(500).json({ message: error.message });
  }
};
