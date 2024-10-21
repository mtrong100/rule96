import axios from "../configs/axios";

export const getArtistsApi = async (params) => {
  const response = await axios.get("/artists", { params });
  return response;
};

export const createArtistApi = async (data) => {
  const response = await axios.post("/artists/create", data);
  return response;
};

export const updateArtistApi = async (id, data) => {
  const response = await axios.put(`/artists/update/${id}`, data);
  return response;
};

export const deleteArtistApi = async (id) => {
  const response = await axios.delete(`/artists/delete/${id}`);
  return response;
};
