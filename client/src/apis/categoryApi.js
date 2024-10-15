import axios from "../configs/axios";

export const getCategoriesApi = async (params) => {
  const response = await axios.get("/categories", { params });
  return response;
};

export const createCategoryApi = async (data) => {
  const response = await axios.post("/categories/create", data);
  return response;
};
