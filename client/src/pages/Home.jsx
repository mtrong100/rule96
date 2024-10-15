import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { toast } from "react-hot-toast";
import { getVideosApi } from "../apis/videoApi";
import { ProgressSpinner } from "primereact/progressspinner";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideosApi();
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-4 gap-2">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            title={video.title}
            videoUrl={video.video}
            views={video.views}
            uploadDate={video.createdAt}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;
