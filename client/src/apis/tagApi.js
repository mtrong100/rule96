import axios from "../configs/axios";

export const getTagsApi = async (params) => {
  const response = await axios.get("/tags", { params });
  return response;
};

export const createTagApi = async (data) => {
  const response = await axios.post("/tags/create", data);
  return response;
};
