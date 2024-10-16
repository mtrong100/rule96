import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserDetailsApi, getUserVideosApi } from "../apis/userApi";
import toast from "react-hot-toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { formatDate } from "../utils/helper";
import { getUserFavoritesApi } from "../apis/favoriteApi";
import VideoCard from "../components/VideoCard";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await getUserDetailsApi(userId);
      if (response) setUser(response.results);
    } catch (error) {
      console.log("Error fetching user:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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
      <Card>
        <div className="grid grid-cols-2 items-start place-items-center gap-12">
          <div className="space-y-5 w-full">
            <div className="flex justify-center gap-5 flex-col items-center ">
              <img
                src={user?.avatar}
                className="rounded-full w-[200px] h-[200px] object-cover"
              />
            </div>

            <Divider />

            <div>About me: {user?.about}</div>
          </div>

          <div className="w-full flex flex-col h-full">
            <ul className="grid grid-cols-2 items-start flex-1">
              <div className="space-y-1">
                <li>Username: {user?.username}</li>
                <li>Email: {user?.email}</li>
                <li>Gender: {user?.gender}</li>
                <li>Age: {user?.age}</li>
              </div>
              <div className="space-y-1">
                <li>City: {user?.city}</li>
                <li>Country: {user?.country}</li>
                <li>Relationship Status: {user?.relationshipStatus}</li>
                <li>Joined: {formatDate(user?.createdAt)}</li>
              </div>
            </ul>
          </div>
        </div>
      </Card>

      <div className="mt-5">
        <TabView>
          <TabPanel header="Videos">
            <UserVideos userId={userId} />
          </TabPanel>
          <TabPanel header="Favorites">
            <UserFavoriteVideos userId={userId} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default UserProfile;

function UserVideos({ userId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getUserVideosApi(userId);
      if (response) setVideos(response.results);
    } catch (error) {
      console.log("Error fetching user videos:", error);
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
      <div className="flex items-center justify-center mt-10">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 gap-2">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

function UserFavoriteVideos({ userId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getUserFavoritesApi(userId);
      if (response) setVideos(response.results);
    } catch (error) {
      console.log("Error fetching user favorite videos:", error);
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
      <div className="flex items-center justify-center mt-10">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 gap-2">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
