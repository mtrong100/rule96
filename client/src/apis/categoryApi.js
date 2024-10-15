import axios from "../configs/axios";

export const createCategoryApi = async () => {
  const response = await axios.get("/categories/create");
  return response;
};
