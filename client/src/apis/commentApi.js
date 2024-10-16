import axios from "../configs/axios";

export const getCommentsFromVideoApi = async (videoId) => {
  const response = await axios.get(`/comments/${videoId}`);
  return response;
};

export const createCommentApi = async (data) => {
  const response = await axios.post("/comments/create", data);
  return response;
};

export const deleteCommentApi = async (id) => {
  const response = await axios.delete(`/comments/delete/${id}`);
  return response;
};
