import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const { name, status } = req.query;

    const filter = {};

    if (name) filter.name = name;
    if (status) filter.status = status;

    const categories = await Category.find(filter);
    return res
      .status(200)
      .json({ message: "Categories fetched", results: categories });
  } catch (error) {
    console.log("Error getting categories", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const uniqueName = await Category.findOne({ name });

    if (uniqueName) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await Category.create({
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
