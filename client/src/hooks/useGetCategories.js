import { useState } from "react";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../apis/categoryApi";

export default function useGetCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoriesApi({ status: "Active" });
      if (response) setCategories(response.results);
    } catch (error) {
      console.log("Failed to fetch categories:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, fetchCategories };
}
