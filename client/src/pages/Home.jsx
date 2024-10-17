import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { toast } from "react-hot-toast";
import { getVideosApi } from "../apis/videoApi";
import { ProgressSpinner } from "primereact/progressspinner";
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

const Home = () => {
  const [videos, setVideos] = useState([]);
  const { tags, fetchTags } = useGetTags();
  const { categories, fetchCategories } = useGetCategories();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [filter, setFilter] = useState({
    category: "",
    tag: "",
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideosApi({
        ...filter,
        title: debounceQuery,
      });
      if (response) setVideos(response.results);
    } catch (error) {
      console.log("Error fetching videos:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilter({
      category: "",
      tag: "",
    });
    setQuery("");
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
          Browse more Videos
        </h1>
        <div className="grid grid-cols-4 gap-2">
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
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search videos..."
              className="w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
