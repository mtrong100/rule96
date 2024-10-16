import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  dislikeVideoApi,
  getVideoDetailsApi,
  likeVideoApi,
} from "../apis/videoApi";
import toast from "react-hot-toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { formatDate, formatDuration } from "../utils/helper";
import { Button } from "primereact/button";
import { getFavoriteDetailsApi, toggleFavoriteApi } from "../apis/favoriteApi";
import { userStore } from "../zustand/userStore";

const VideoDetail = () => {
  const { videoId } = useParams();
  const currentUser = userStore((state) => state.currentUser);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteVideo, setFavoriteVideo] = useState(null);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const response = await getVideoDetailsApi(videoId);
      if (response) setVideo(response.results);
    } catch (error) {
      console.log("Error fetching video:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteVideo = async () => {
    try {
      const response = await getFavoriteDetailsApi(videoId);
      if (response) setFavoriteVideo(response.results);
    } catch (error) {
      console.log("Error fetching favorite video:", error);
      toast.error(error.message);
    }
  };

  const onReport = () => toast.error("Shut the fuck up bitch!");

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const onLikeVideo = async () => {
    try {
      const response = await likeVideoApi(videoId);
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error liking video:", error);
      toast.error(error.message);
    } finally {
      fetchVideo();
    }
  };

  const onDislikeVideo = async () => {
    try {
      const response = await dislikeVideoApi(videoId);
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error disliking video:", error);
      toast.error(error.message);
    } finally {
      fetchVideo();
    }
  };

  const onToggleFavorite = async () => {
    try {
      const response = await toggleFavoriteApi(videoId);
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error toggling favorite:", error);
      toast.error(error.message);
    } finally {
      fetchFavoriteVideo();
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchFavoriteVideo();
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
      <div className="flex items-center gap-5 mb-5">
        <Button
          onClick={() => window.history.back()}
          label="Back"
          icon="pi pi-arrow-left"
        />
        <h1 className="text-3xl font-semibold">{video?.title}</h1>
      </div>

      <video
        poster={video?.thumbnail}
        src={video?.video}
        width="100%"
        height="100%"
        controls
        autoPlay={false}
      />

      <Card className="mt-2">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Button
              icon={`pi ${
                video?.likes?.includes(currentUser?._id)
                  ? "pi-thumbs-up-fill"
                  : "pi-thumbs-up"
              }`}
              label={`Like (${video?.totalLikes})`}
              severity="secondary"
              onClick={onLikeVideo}
            />
            <Button
              icon={`pi ${
                video?.dislikes?.includes(currentUser?._id)
                  ? "pi-thumbs-down-fill"
                  : "pi-thumbs-down"
              }`}
              label={`Dislike (${video?.totalDislikes})`}
              severity="secondary"
              onClick={onDislikeVideo}
            />
            <Button
              icon={`pi ${
                favoriteVideo?.video === videoId ? "pi-heart-fill" : "pi-heart"
              }`}
              label={`${
                favoriteVideo?.video === videoId
                  ? "Remove From Favorites"
                  : "Add To Favorites"
              } `}
              severity="contrast"
              onClick={onToggleFavorite}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onReport}
              icon="pi pi-flag"
              label="Report"
              severity="danger"
            />
            <Button
              onClick={onCopyLink}
              icon="pi pi-share-alt"
              label="Share"
              severity="info"
            />
          </div>
        </div>
      </Card>

      <Card className="mt-2">
        <TabView>
          <TabPanel header="About">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-calendar"></i>
                  {formatDate(video?.createdAt)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-eye"></i>
                  {video?.totalViews}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-clock"></i>
                  {formatDuration(video?.duration)}
                </div>
              </div>

              <div>
                Tags:{" "}
                {video?.tags?.map((tag) => (
                  <Tag
                    key={tag?._id}
                    value={tag?.name}
                    className="capitalize"
                  />
                ))}
              </div>
              <div>
                Categories:{" "}
                {video?.categories?.map((cat) => (
                  <Tag
                    key={cat?._id}
                    value={cat?.name}
                    className="capitalize"
                  />
                ))}
              </div>

              <div>Description: {video?.description}</div>
            </div>
          </TabPanel>
          <TabPanel header="Comments">
            <p className="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default VideoDetail;
