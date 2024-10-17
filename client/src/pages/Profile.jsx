import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";
import {
  getUserVideosApi,
  logoutUserApi,
  updateUserProfileApi,
} from "../apis/userApi";
import { userStore } from "../zustand/userStore";
import { formatDate } from "../utils/helper";
import { InputNumber } from "primereact/inputnumber";
import { useNavigate } from "react-router-dom";
import { uploadImageApi } from "../apis/uploadApi";
import { ProgressSpinner } from "primereact/progressspinner";
import VideoCard from "../components/VideoCard";
import { getUserFavoritesApi } from "../apis/favoriteApi";

const Profile = () => {
  const navigate = useNavigate();
  const setCurrentUser = userStore((state) => state.setCurrentUser);
  const currentUser = userStore((state) => state.currentUser);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    avatar: "",
    username: "",
    gender: "",
    age: 0,
    city: "",
    country: "",
    relationshipStatus: "",
    about: "",
  });

  const onUpdateProfile = async () => {
    if (!form.username) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);

    try {
      const response = await updateUserProfileApi({ ...form });
      if (response) {
        setCurrentUser(response.results);
        toast.success(response.message);
      }
    } catch (error) {
      console.log("Failed to update profile:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const response = await uploadImageApi(formData);
      if (response) setForm({ ...form, avatar: response?.data?.url });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const onLogout = async () => {
    try {
      const response = await logoutUserApi();
      if (response) {
        setCurrentUser(null);
        toast.success(response.message);
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.log("Error logging out user", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setForm({
        avatar: currentUser?.avatar,
        username: currentUser?.username,
        gender: currentUser?.gender,
        age: currentUser?.age,
        city: currentUser?.city,
        country: currentUser?.country,
        relationshipStatus: currentUser?.relationshipStatus,
        about: currentUser?.about,
      });
    }
  }, [currentUser]);

  return (
    <div>
      <Card>
        <div className="grid grid-cols-2 items-start place-items-center gap-12">
          <div className="space-y-5 w-full">
            <div className="flex justify-center gap-5 flex-col items-center ">
              <img
                src={currentUser?.avatar}
                className="rounded-full w-[200px] h-[200px] object-cover"
              />
            </div>

            <Divider />

            <div>About me: {currentUser?.about}</div>
          </div>

          <div className="w-full flex flex-col h-full">
            <ul className="grid grid-cols-2 items-start flex-1">
              <div className="space-y-1">
                <li>Username: {currentUser?.username}</li>
                <li>Email: {currentUser?.email}</li>
                <li>Gender: {currentUser?.gender}</li>
                <li>Age: {currentUser?.age}</li>
              </div>
              <div className="space-y-1">
                <li>City: {currentUser?.city}</li>
                <li>Country: {currentUser?.country}</li>
                <li>Relationship Status: {currentUser?.relationshipStatus}</li>
                <li>Joined: {formatDate(currentUser?.createdAt)}</li>
              </div>
            </ul>

            <div className="flex items-center justify-between">
              <Button
                label="Logout"
                icon="pi pi-sign-out"
                severity="danger"
                onClick={onLogout}
              />
              <div className="flex items-center gap-3">
                <Button
                  label="Reset Password"
                  icon="pi pi-shield"
                  severity="contrast"
                  onClick={() => navigate("/reset-password")}
                />
                <Button
                  label="Update Profile"
                  icon="pi pi-user-edit"
                  severity="secondary"
                  onClick={() => setVisible(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5">
        <TabView>
          <TabPanel header="Videos">
            <UserVideos />
          </TabPanel>
          <TabPanel header="Favorites">
            <UserFavoriteVideos />
          </TabPanel>
        </TabView>
      </div>

      <Dialog
        header="Update Profile"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <form className="space-y-5">
          <div className="flex justify-center gap-5 flex-col items-center ">
            <img
              src={form?.avatar}
              className="rounded-full w-[200px] h-[200px] object-cover"
            />
            {uploading ? (
              <p className="text-center">Uploading....</p>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="username">
              Username
            </label>
            <InputText
              id="username"
              placeholder="Enter your username..."
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="age">
              age
            </label>
            <InputNumber
              id="age"
              placeholder="Enter your age..."
              value={form.age}
              onValueChange={(e) =>
                setForm((prev) => ({ ...prev, age: e.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="country">
              country
            </label>
            <InputText
              id="country"
              placeholder="Enter your country..."
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="city">
              city
            </label>
            <InputText
              id="city"
              placeholder="Enter your city..."
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="gender">
              gender
            </label>
            <Dropdown
              value={form.gender}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gender: e.value }))
              }
              options={["Male", "Female", "Gay"]}
              placeholder="Select gender"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="relationshipStatus">
              relationship Status
            </label>
            <Dropdown
              value={form.relationshipStatus}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  relationshipStatus: e.value,
                }))
              }
              options={["Single", "Married", "Engaged"]}
              placeholder="Select relationship status"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="about">
              about
            </label>
            <InputTextarea
              value={form.about}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, about: e.target.value }))
              }
              rows={5}
              cols={30}
              placeholder="About me..."
            />
          </div>

          <Button
            type="button"
            className="w-full"
            label="Update Profile"
            loading={loading}
            disabled={loading}
            onClick={onUpdateProfile}
          />
        </form>
      </Dialog>
    </div>
  );
};

export default Profile;

function UserVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = userStore((state) => state.currentUser);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getUserVideosApi(currentUser?._id);
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

function UserFavoriteVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = userStore((state) => state.currentUser);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getUserFavoritesApi(currentUser?._id);
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
