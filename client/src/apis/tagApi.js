import axios from "../configs/axios";

export const createTagApi = async (data) => {
  const response = await axios.post("/tags/create", data);
  return response;
};
