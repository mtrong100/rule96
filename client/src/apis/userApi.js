import axios from "../configs/axios";

export const getUsersApi = async (params) => {
  const response = await axios.get("/users", { params });
  return response;
};

export const getUserDetailsApi = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response;
};

export const getUserVideosApi = async () => {
  const response = await axios.get(`/users/videos`);
  return response;
};

export const registerUserApi = async (data) => {
  const response = await axios.post("/users/register", data);
  return response;
};

export const loginUserApi = async (data) => {
  const response = await axios.post("/users/login", data);
  return response;
};

export const logoutUserApi = async () => {
  const response = await axios.post("/users/logout");
  return response;
};

export const sendOtpApi = async (data) => {
  const response = await axios.post("/users/send-otp", data);
  return response;
};

export const resetPasswordApi = async (data) => {
  const response = await axios.put("/users/reset-password", data);
  return response;
};

export const updateUserApi = async (id, data) => {
  const response = await axios.put(`/users/update/${id}`, data);
  return response;
};

export const deleteUserApi = async (id) => {
  const response = await axios.delete(`/users/delete/${id}`);
  return response;
};

export const updateUserProfileApi = async (data) => {
  const response = await axios.put("/users/profile", data);
  return response;
};
