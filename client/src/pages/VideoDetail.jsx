import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import {
  createCommentApi,
  deleteCommentApi,
  getCommentsFromVideoApi,
} from "../apis/commentApi";
import Comment from "../components/Comment";
import { useNavigate } from "react-router-dom";
import useGetVideos from "../hooks/useGetVideos";
import { Skeleton } from "primereact/skeleton";
import VideoCard from "../components/VideoCard";

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.currentUser);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteVideo, setFavoriteVideo] = useState(null);
  const { fetchVideos, videos, pending } = useGetVideos();

  const filteredVideos = videos.filter((item) => item._id !== videoId);

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
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

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
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

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
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

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
  }, [videoId]);

  useEffect(() => {
    fetchVideos();
  }, []);

  // FIX SCROLL BUG
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [videoId]);

  useEffect(() => {
    if (currentUser) fetchFavoriteVideo();
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
      <div className="md:flex hidden flex-row items-center gap-5 mb-5 ">
        <Button
          onClick={() => window.history.back()}
          label="Back"
          icon="pi pi-arrow-left"
        />
        <div className="text-3xl flex-1 font-bold">{video?.title}</div>
      </div>

      <h1 className="text-lg font-bold mb-3 md:hidden">{video?.title}</h1>

      <video
        poster={video?.thumbnail}
        src={video?.video}
        controls
        autoPlay={false}
        className="w-full h-[350px] md:h-[670px] object-contain border border-gray-800 rounded-md"
      />

      {/* For mobile */}
      <Card className="mt-2 md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button
            icon={`pi ${
              video?.likes?.includes(currentUser?._id)
                ? "pi-thumbs-up-fill"
                : "pi-thumbs-up"
            }`}
            label={`Like (${video?.totalLikes})`}
            severity="secondary"
            onClick={onLikeVideo}
            size="small"
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
            size="small"
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
            size="small"
          />
          <Button
            onClick={onReport}
            icon="pi pi-flag"
            label="Report"
            severity="danger"
            size="small"
          />
          <Button
            onClick={onCopyLink}
            icon="pi pi-share-alt"
            label="Share"
            severity="info"
            size="small"
          />
        </div>
      </Card>

      {/* For Desktop */}
      <Card className="mt-2 hidden md:block">
        <div className="flex items-center gap-3 justify-between ">
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
            <div className="space-y-3 text-xs md:text-base">
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

              <div className="flex items-center gap-4">
                Uploaded by:{" "}
                <div className="flex items-center gap-2">
                  <img
                    src={video?.user?.avatar}
                    alt=""
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  <Link
                    className="hover:text-purple-300"
                    to={`/profile/${video?.user?._id}`}
                  >
                    {video?.user?.username}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                Tags:{" "}
                {video?.tags?.map((tag) => (
                  <Tag
                    key={tag?._id}
                    value={tag?.name}
                    className="capitalize "
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                Categories:{" "}
                {video?.categories?.map((cat) => (
                  <Tag
                    key={cat?._id}
                    value={cat?.name}
                    className="capitalize "
                  />
                ))}
              </div>

              <div>Description: {video?.description}</div>
            </div>
          </TabPanel>
          <TabPanel header="Comments">
            {!currentUser ? (
              <Button
                severity="warning"
                label="Login To Comment"
                className="mt-3 flex justify-center items-center mx-auto"
                onClick={() => navigate("/sign-in")}
              />
            ) : (
              <CommentSection videoId={videoId} />
            )}
          </TabPanel>
        </TabView>
      </Card>

      <Divider />

      <section className="space-y-5 mb-5">
        <h1 className="text-2xl md:text-4xl font-bold capitalize">
          Recommended for you
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-2">
          {pending &&
            Array(8)
              .fill(0)
              .map((item, index) => (
                <Skeleton key={index} height="307px"></Skeleton>
              ))}

          {!pending &&
            filteredVideos
              .slice(0, 12)
              .map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      </section>
    </div>
  );
};

export default VideoDetail;

function CommentSection({ videoId }) {
  const currentUser = userStore((state) => state.currentUser);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const fetchComments = async () => {
    setLoading1(true);
    try {
      const response = await getCommentsFromVideoApi(videoId);
      if (response) setComments(response.results);
    } catch (error) {
      console.log("Error fetching comments:", error);
      toast.error(error.message);
    } finally {
      setLoading1(false);
    }
  };

  const onCreateComment = async () => {
    setLoading(true);
    try {
      const response = await createCommentApi({
        video: videoId,
        content: value.trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error creating comment:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setValue("");
      fetchComments();
    }
  };

  const onDeleteComment = async (commentId) => {
    setLoading2(true);
    try {
      const response = await deleteCommentApi(commentId);
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error deleting comment:", error);
      toast.error(error.message);
    } finally {
      setLoading2(false);
      fetchComments();
    }
  };

  useEffect(() => {
    if (currentUser) fetchComments();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-xl md:text-3xl font-semibold mb-5">
        Write your comment
      </h1>
      <div className="space-y-2">
        <InputTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          cols={30}
          className="w-full"
          placeholder="Enter your comment..."
        />
        <Button
          label="Submit"
          className="md:flex md:ml-auto w-full"
          loading={loading}
          disabled={loading}
          onClick={onCreateComment}
        />
      </div>

      <Divider />

      <div>
        <h1 className="text-xl md:text-3xl font-semibold mb-5">
          Total Comments ({comments?.length || 0})
        </h1>

        <ul className="space-y-3">
          {loading1 ? (
            <div className="flex items-center justify-center h-screen">
              <ProgressSpinner />
            </div>
          ) : (
            comments?.map((comment) => (
              <Comment
                key={comment?._id}
                cmt={comment}
                onDelete={onDeleteComment}
                loading={loading2}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
