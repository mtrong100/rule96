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
            <CommentSection videoId={videoId} />
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default VideoDetail;

function CommentSection({ videoId }) {
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
    fetchComments();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold mb-5">Write your comment</h1>
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
          className="flex ml-auto"
          loading={loading}
          disabled={loading}
          onClick={onCreateComment}
        />
      </div>

      <Divider />

      <div>
        <h1 className="text-3xl font-semibold mb-5">
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
