import axios from "../configs/axios";

export const getVideosApi = async (params) => {
  const response = await axios.get("/videos", { params });
  return response;
};

export const createVideoApi = async (data) => {
  const response = await axios.post("/videos/create", data);
  return response;
};
