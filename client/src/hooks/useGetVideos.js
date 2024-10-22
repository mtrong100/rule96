import { useState } from "react";
import { getVideosApi } from "../apis/videoApi";
import toast from "react-hot-toast";

export default function useGetVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideosApi();
      if (response) setVideos(response.results);
    } catch (error) {
      console.log("Failed to fetch videos:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { videos, pending: loading, fetchVideos };
}
