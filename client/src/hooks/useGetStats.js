import { useState } from "react";
import { getCountStatsApi, getVideoStatsApi } from "../apis/statsApi";
import toast from "react-hot-toast";

export default function useGetStats() {
  const [countStats, setCountStats] = useState(null);
  const [videoStats, setVideoStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const fetchVideoStats = async () => {
    setLoading(true);
    try {
      const response = await getVideoStatsApi();
      if (response) setVideoStats(response.results);
    } catch (error) {
      console.log("Failed to fetch video stats:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountStats = async () => {
    setLoading2(true);
    try {
      const response = await getCountStatsApi();
      if (response) setCountStats(response.results);
    } catch (error) {
      console.log("Failed to fetch count stats:", error);
      toast.error(error.message);
    } finally {
      setLoading2(false);
    }
  };

  return {
    countStats,
    videoStats,
    loading,
    loading2,
    fetchCountStats,
    fetchVideoStats,
  };
}
