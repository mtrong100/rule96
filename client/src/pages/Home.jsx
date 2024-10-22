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
import useGetArtist from "../hooks/useGetArtist";
import Empty from "../components/Empty";
import { Skeleton } from "primereact/skeleton";

const Home = () => {
  const filter = filterStore((state) => state.filter);
  const setFilter = filterStore((state) => state.setFilter);
  const clearFilter = filterStore((state) => state.clearFilter);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tags, fetchTags } = useGetTags();
  const { categories, fetchCategories } = useGetCategories();
  const { artists, fetchArtist } = useGetArtist();
  const debounceQuery = useDebounce(filter.title, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

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

  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = videos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchVideos();
  }, [filter, debounceQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceQuery]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchArtist();
  }, []);

  return (
    <main>
      <Card>
        <div className="flex items-center justify-between  mb-5 ">
          <h1 className="text-3xl font-semibold capitalize">
            Browse more Videos By Filter
          </h1>
          <Button
            onClick={clearFilter}
            label="Clear Filter"
            icon="pi pi-filter-slash"
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          <Dropdown
            options={artists}
            optionLabel="name"
            optionValue="_id"
            placeholder="Select your artist..."
            filter
            filterPlaceholder="Search your artist..."
            scrollHeight="400px"
            value={filter.artist}
            onChange={(e) => setFilter({ ...filter, artist: e.value })}
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
            placeholder="Select timestamp"
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

      {videos.length === 0 && <Empty />}

      <div className="grid grid-cols-4 gap-2 ">
        {loading &&
          Array(itemsPerPage)
            .fill(0)
            .map((item, index) => (
              <Skeleton key={index} height="307px"></Skeleton>
            ))}

        {!loading &&
          currentVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
      </div>

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
    </main>
  );
};

export default Home;
