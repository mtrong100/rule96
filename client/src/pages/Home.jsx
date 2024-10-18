import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { toast } from "react-hot-toast";
import { getVideosApi } from "../apis/videoApi";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import useDebounce from "../hooks/useDebounce";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import useGetCategories from "../hooks/useGetCategories";
import useGetTags from "../hooks/useGetTags";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { DATE_FILTERS } from "../utils/constants";
import { filterStore } from "../zustand/filterStore";

const Home = () => {
  const filter = filterStore((state) => state.filter);
  const setFilter = filterStore((state) => state.setFilter);
  const clearFilter = filterStore((state) => state.clearFilter);
  const [videos, setVideos] = useState([]);
  const { tags, fetchTags } = useGetTags();
  const { categories, fetchCategories } = useGetCategories();
  const [loading, setLoading] = useState(false);
  const debounceQuery = useDebounce(filter.title, 500);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideosApi({ ...filter, title: debounceQuery });
      if (response) setVideos(response.results);
    } catch (error) {
      console.log("Error fetching videos:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filter, debounceQuery]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <main>
      <Card>
        <h1 className="text-3xl font-semibold mb-5 capitalize">
          Browse more Videos By Filter
        </h1>
        <div className="grid grid-cols-5 gap-2">
          <Button
            onClick={clearFilter}
            label="Clear Filter"
            icon="pi pi-filter-slash"
          />

          <Dropdown
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.value })}
            options={categories}
            optionLabel="name"
            optionValue="_id"
            filter
            filterPlaceholder="Search a category"
            placeholder="Select a category"
            scrollHeight="400px"
          />
          <Dropdown
            value={filter.tag}
            onChange={(e) => setFilter({ ...filter, tag: e.value })}
            options={tags}
            optionLabel="name"
            optionValue="_id"
            filter
            filterPlaceholder="Search a tag"
            placeholder="Select a tag"
            scrollHeight="400px"
          />
          <Dropdown
            value={filter.dateFilter}
            onChange={(e) => setFilter({ ...filter, dateFilter: e.value })}
            options={DATE_FILTERS}
            optionLabel="label"
            optionValue="value"
            placeholder="Select date filter"
            scrollHeight="300px"
          />
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search title..."
              className="w-full"
              value={filter.title}
              onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            />
          </IconField>
        </div>
      </Card>

      <Divider />

      {videos.length === 0 && (
        <h1 className="text-3xl text-center font-semibold my-56 capitalize">
          No videos found
        </h1>
      )}

      <div className="grid grid-cols-4 gap-2 ">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </main>
  );
};

export default Home;
