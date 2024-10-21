import axios from "../configs/axios";

export const getVideosApi = async (params) => {
  const response = await axios.get("/videos", { params });
  return response;
};

export const getVideoDetailsApi = async (id) => {
  const response = await axios.get(`/videos/${id}`);
  return response;
};

export const createVideoApi = async (data) => {
  const response = await axios.post("/videos/create", data);
  return response;
};

export const increaseViewCountApi = async (id) => {
  const response = await axios.put(`/videos/view/${id}`);
  return response;
};

export const likeVideoApi = async (id) => {
  const response = await axios.put(`/videos/like/${id}`);
  return response;
};

export const dislikeVideoApi = async (id) => {
  const response = await axios.put(`/videos/dislike/${id}`);
  return response;
};

export const updateVideoApi = async (id, data) => {
  const response = await axios.put(`/videos/update/${id}`, data);
  return response;
};

export const deleteVideoApi = async (id) => {
  const response = await axios.delete(`/videos/delete/${id}`);
  return response;
};
