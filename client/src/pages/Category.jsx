import React, { useEffect, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../apis/categoryApi";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import noImage from "../assets/no-image.png";
import { filterStore } from "../zustand/filterStore";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();
  const setFilter = filterStore((state) => state.setFilter);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

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

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const onSelectCategory = (categoryId) => {
    if (!categoryId) return;
    setFilter({ category: categoryId });
    navigate("/");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceQuery]);

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
        {currentCategories.map((item) => (
          <Card
            onClick={() => onSelectCategory(item?._id)}
            key={item?._id}
            className="hover:bg-zinc-800 cursor-pointer"
          >
            <img
              src={item?.image || noImage}
              alt=""
              className="w-full h-[160px] object-cover rounded-md"
            />
            <h1 className="mt-3 capitalize">{`${item?.name} (${
              item?.totalVideos || 0
            })`}</h1>
          </Card>
        ))}
      </ul>

      <div className="flex justify-center mt-7 gap-2">
        <Button
          label="Previous"
          icon="pi pi-chevron-left"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <div>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              label={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${
                currentPage === index + 1 ? "bg-zinc-700 " : "bg-zinc-800"
              } text-white`}
            />
          ))}
        </div>
        <Button
          label="Next"
          icon="pi pi-chevron-right"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default Category;
