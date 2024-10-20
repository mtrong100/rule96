import axios from "../configs/axios";

export const getCategoriesApi = async (params) => {
  const response = await axios.get("/categories", { params });
  return response;
};

export const createCategoryApi = async (data) => {
  const response = await axios.post("/categories/create", data);
  return response;
};

export const updateCategoryApi = async (id, data) => {
  const response = await axios.put(`/categories/update/${id}`, data);
  return response;
};

export const deleteCategoryApi = async (id) => {
  const response = await axios.delete(`/categories/delete/${id}`);
  return response;
};
