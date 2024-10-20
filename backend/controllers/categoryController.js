import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const { name, status } = req.query;

    const filter = {};

    if (name) filter.name = name;
    if (status) filter.status = status;

    const categories = await Category.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "categories",
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, status } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image, status },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Category updated", results: updatedCategory });
  } catch (error) {
    console.log("Error updating category", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.log("Error deleting category", error.message);
    return res.status(500).json({ message: error.message });
  }
};
