import axios from "../configs/axios";

export const getFavoritesApi = async () => {
  const response = await axios.get("/favorites");
  return response;
};

export const getUserFavoritesApi = async (userId) => {
  const response = await axios.get(`/favorites/user/${userId}`);
  return response;
};

export const getFavoriteDetailsApi = async (id) => {
  const response = await axios.get(`/favorites/${id}`);
  return response;
};

export const toggleFavoriteApi = async (id) => {
  const response = await axios.put(`/favorites/toggle/${id}`);
  return response;
};
