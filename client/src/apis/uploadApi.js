import axios from "axios";

export const uploadImageApi = async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/upload/single-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

export const uploadVideoApi = async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/upload/single-video`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};
