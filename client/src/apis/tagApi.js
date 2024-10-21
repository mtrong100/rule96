import axios from "../configs/axios";

export const getTagsApi = async (params) => {
  const response = await axios.get("/tags", { params });
  return response;
};

export const createTagApi = async (data) => {
  const response = await axios.post("/tags/create", data);
  return response;
};

export const updateTagApi = async (id, data) => {
  const response = await axios.put(`/tags/update/${id}`, data);
  return response;
};

export const deleteTagApi = async (id) => {
  const response = await axios.delete(`/tags/delete/${id}`);
  return response;
};
