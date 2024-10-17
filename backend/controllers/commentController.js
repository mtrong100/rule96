import Comment from "../models/commentModel.js";

export const getCommentsFromVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate({
        path: "user",
        select: "username avatar",
      })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Comments fetched", results: comments });
  } catch (error) {
    console.log("Error getting comments from video", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, video } = req.body;
    const user = req.user._id;
    const newComment = new Comment({
      user,
      content,
      video,
    });
    await newComment.save();
    return res.status(201).json({ message: "Comment created" });
  } catch (error) {
    console.log("Error creating comment", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.log("Error deleting comment", error.message);
    return res.status(500).json({ message: error.message });
  }
};
