import Favorite from "../models/favoriteModel.js";

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: "video",
      select: "title createdAt totalViews video",
    });
    return res
      .status(200)
      .json({ message: "Favorites fetched", results: favorites });
  } catch (error) {
    console.log("Error getting favorites", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.params.userId || req.user._id,
    }).populate({
      path: "video",
    });

    const formatResults = favorites.map((favorite) => favorite.video);

    return res
      .status(200)
      .json({ message: "Favorites fetched", results: formatResults });
  } catch (error) {
    console.log("Error getting user favorites", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getFavoriteDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const favorite = await Favorite.findOne({ video: videoId });
    return res
      .status(200)
      .json({ message: "Favorite details fetched", results: favorite });
  } catch (error) {
    console.log("Error getting favorite details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  const { videoId } = req.params;

  try {
    const favorite = await Favorite.findOne({
      video: videoId,
      user: req.user._id,
    });

    if (!favorite) {
      const newFavorite = new Favorite({ video: videoId, user: req.user._id });
      await newFavorite.save();
      return res
        .status(201)
        .json({ message: "Video added to favorites successfully" });
    } else {
      await Favorite.deleteOne({ _id: favorite._id });
      return res
        .status(200)
        .json({ message: "Video removed from favorites successfully" });
    }
  } catch (error) {
    console.log("Error toggling favorite", error.message);
    return res.status(500).json({ message: error.message });
  }
};
