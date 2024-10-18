import { useState } from "react";
import toast from "react-hot-toast";
import { getArtistsApi } from "../apis/artistApi";

export default function useGetArtist() {
  const [artist, setArtist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArtist = async () => {
    setLoading(true);
    try {
      const response = await getArtistsApi({ status: "Active" });
      if (response) setArtist(response.results);
    } catch (error) {
      console.log("Failed to fetch artist:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { artists: artist, loading, fetchArtist };
}
