import React, { useEffect, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../apis/categoryApi";
import { Card } from "primereact/card";
import Image from "../assets/no-image.png";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        Total Categories ({categories.length || 0})
      </h1>
      <div className="mt-5">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search your categories..."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </IconField>
      </div>

      <ul className="grid grid-cols-5 gap-2 mt-5">
        {filteredCategories.map((item) => (
          <Card key={item?._id}>
            <img
              src={item?.image || Image}
              alt=""
              className="w-full h-[160px] object-cover rounded-md"
            />
            <h1 className="mt-3 capitalize">{`${item?.name} (${
              item?.totalVideos || 0
            })`}</h1>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default Category;
