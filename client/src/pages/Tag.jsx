import React, { useEffect, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import useDebounce from "../hooks/useDebounce";
import { getTagsApi } from "../apis/tagApi";
import toast from "react-hot-toast";
import { filterStore } from "../zustand/filterStore";
import { useNavigate } from "react-router-dom";
import Empty from "../components/Empty";

const Tag = () => {
  const navigate = useNavigate();
  const setFilter = filterStore((state) => state.setFilter);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getTagsApi({
        status: "Active",
      });
      if (response) setTags(response.results);
    } catch (error) {
      console.log("Failed to fetch tags:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const onSelectTag = (tagId) => {
    if (!tagId) return;
    setFilter({ tag: tagId });
    navigate("/");
  };

  // FIX SCROLL BUG
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-bold">
        Total Tags ({tags.length || 0})
      </h1>

      <div className="mt-3 md:mt-5">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search your tags..."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </IconField>
      </div>

      {!loading && filteredTags.length === 0 && <Empty />}

      <ul className="items-center flex flex-wrap gap-2 mt-5">
        {filteredTags.map((item) => (
          <li key={item?._id}>
            <Chip
              onClick={() => onSelectTag(item?._id)}
              label={`${item?.name} (${item?.totalVideos || 0})`}
              icon="pi pi-hashtag"
              className="hover:bg-zinc-700 cursor-pointer text-xs md:text-base"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tag;
