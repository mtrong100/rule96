import axios from "../configs/axios";

export const getArtistsApi = async (params) => {
  const response = await axios.get("/artists", { params });
  return response;
};

export const createArtistApi = async (data) => {
  const response = await axios.post("/artists/create", data);
  return response;
};
