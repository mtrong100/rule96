import { useState } from "react";
import { getTagsApi } from "../apis/tagApi";
import toast from "react-hot-toast";

export default function useGetTags() {
  const [tags, setTags] = useState();
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getTagsApi({ status: "Active" });
      if (response) setTags(response.results);
    } catch (error) {
      console.log("Failed to fetch tags:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, fetchTags };
}
