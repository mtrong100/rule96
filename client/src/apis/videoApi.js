import axios from "../configs/axios";

export const createVideoApi = async (data) => {
  const response = await axios.post("/videos/create", data);
  return response;
};
