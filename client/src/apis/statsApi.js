import axios from "../configs/axios";

export const getCountStatsApi = async () => {
  const response = await axios.get("/stats/count-stats");
  return response;
};

export const getVideoStatsApi = async () => {
  const response = await axios.get("/stats/video-stats");
  return response;
};
