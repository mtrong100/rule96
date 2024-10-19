import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import useGetTags from "../hooks/useGetTags";
import useGetCategories from "../hooks/useGetCategories";
import { createCategoryApi } from "../apis/categoryApi";
import toast from "react-hot-toast";
import { createVideoApi } from "../apis/videoApi";
import axios from "axios";
import { createTagApi } from "../apis/tagApi";
import { Skeleton } from "primereact/skeleton";
import { createArtistApi } from "../apis/artistApi";
import useGetArtist from "../hooks/useGetArtist";
import { Dropdown } from "primereact/dropdown";
import { generateRandomText } from "../utils/helper";
import { userStore } from "../zustand/userStore";

const Upload = () => {
  const currentUser = userStore((state) => state.currentUser);
  const { tags, fetchTags } = useGetTags();
  const { categories, fetchCategories } = useGetCategories();
  const { artists, fetchArtist } = useGetArtist();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [artist, setArtist] = useState("");
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: [],
    artist: "",
    thumbnail: "",
    video: "",
    duration: 0,
  });

  const onCreateVideo = async () => {
    if (videoForm.title.length > 100) {
      toast.error("Title should be less than 100 characters");
      return;
    }

    if (videoForm.tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }

    if (videoForm.categories.length === 0) {
      toast.error("At least one category is required");
      return;
    }

    if (!videoForm.artist) {
      toast.error("Artist is required");
      return;
    }

    setLoading(true);
    try {
      const randomString = generateRandomText(30);

      const response = await createVideoApi({
        ...videoForm,
        title: videoForm.title || randomString,
        user: currentUser?._id,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create video:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      onDiscard();
    }
  };

  const onUploadVideo = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size should be less than 100 MB");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setProgress(0);
    setUploading2(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload/single-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response) {
        setVideoForm((prev) => ({
          ...prev,
          video: response?.data?.url,
          duration: response?.data?.duration,
        }));
        toast.success("Video uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(error.message);
    } finally {
      setUploading2(false);
      setProgress(0);
    }
  };

  const onUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5 MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setProgress2(0);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload/single-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress2(percentCompleted);
          },
        }
      );
      if (response) {
        setVideoForm({ ...videoForm, thumbnail: response?.data?.url });
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message);
    } finally {
      setUploading(false);
      setProgress2(0);
    }
  };

  const onDiscard = () => {
    // setVideoForm({
    //   title: "",
    //   description: "",
    //   tags: [],
    //   categories: [],
    //   artist: "",
    //   thumbnail: "",
    //   video: "",
    //   duration: 0,
    // });
    window.location.reload();
  };

  const onCreateCategory = async () => {
    if (!category) return;
    setLoading1(true);
    try {
      const response = await createCategoryApi({
        name: category.toLowerCase().trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create category:", error);
      toast.error(error.message);
    } finally {
      setLoading1(false);
      setCategory("");
      fetchCategories();
    }
  };

  const onCreateTag = async () => {
    if (!tag) return;
    setLoading2(true);
    try {
      const response = await createTagApi({
        name: tag.toLowerCase().trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create tag:", error);
      toast.error(error.message);
    } finally {
      setLoading2(false);
      setTag("");
      fetchTags();
    }
  };

  const onCreateArtist = async () => {
    if (!artist) return;
    setLoading3(true);
    try {
      const response = await createArtistApi({
        name: artist.toLowerCase().trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create artist:", error);
      toast.error(error.message);
    } finally {
      setLoading3(false);
      setArtist("");
      fetchArtist();
    }
  };

  useEffect(() => {
    fetchTags();
    fetchCategories();
    fetchArtist();
  }, []);

  return (
    <div className="">
      <form>
        <div className="grid grid-cols-2 gap-10">
          <section className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="title">
                title
              </label>
              <InputText
                id="title"
                placeholder="Enter your title..."
                value={videoForm.title}
                onChange={(e) =>
                  setVideoForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <Divider />

            {/* categories & tags */}
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="categories">
                  select categories (limit 3)
                </label>
                <MultiSelect
                  options={categories}
                  placeholder="Select your categories..."
                  optionLabel="name"
                  filter
                  filterPlaceholder="Search your categories..."
                  scrollHeight="400px"
                  optionValue="_id"
                  maxSelectedLabels={3}
                  value={videoForm.categories}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      categories: e.value,
                    }))
                  }
                />
                <p className="text-gray-400">
                  In case if you can not find your category, just simply create
                  new one at below
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="tags">
                  select tags (limit 5)
                </label>
                <MultiSelect
                  options={tags}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Select your tags..."
                  filter
                  filterPlaceholder="Search your tags..."
                  scrollHeight="400px"
                  maxSelectedLabels={3}
                  value={videoForm.tags}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      tags: e.value,
                    }))
                  }
                />
                <p className="text-gray-400">
                  In case if you can not find your tags, just simply create new
                  one at below
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="artist">
                  select artist
                </label>
                <Dropdown
                  options={artists}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Select your artist..."
                  filter
                  filterPlaceholder="Search your artist..."
                  scrollHeight="400px"
                  value={videoForm.artist}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      artist: e.value,
                    }))
                  }
                />
                <p className="text-gray-400">
                  In case if you can not find your artist, just simply create
                  new one at below
                </p>
              </div>
            </div>

            <Divider />

            {/* create section */}
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="category">
                  create new category
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    id="category"
                    placeholder="Enter your new category..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Create new"
                    icon="pi pi-plus"
                    className="h-[50px]"
                    loading={loading1}
                    disabled={loading1}
                    onClick={onCreateCategory}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="category">
                  create new tag
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    id="tag"
                    placeholder="Enter your new tag..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Create new"
                    icon="pi pi-plus"
                    className="h-[50px]"
                    loading={loading2}
                    disabled={loading2}
                    onClick={onCreateTag}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="category">
                  create new artist
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    id="artist"
                    placeholder="Enter your new artist..."
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Create new"
                    icon="pi pi-plus"
                    className="h-[50px]"
                    loading={loading3}
                    disabled={loading3}
                    onClick={onCreateArtist}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="description">
                description
              </label>
              <InputTextarea
                value={videoForm.description}
                onChange={(e) =>
                  setVideoForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={5}
                cols={30}
                placeholder="Enter your description..."
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="capitalize font-medium" htmlFor="Thumbnail">
                Thumbnail
              </label>
              <div className="flex flex-col gap-2">
                {uploading ? (
                  <p className="text-center text-emerald-500 font-medium ">
                    Uploading... {progress2}%
                  </p>
                ) : (
                  <input
                    type="file"
                    name="Thumbnail"
                    id="Thumbnail"
                    accept="image/*"
                    onChange={onUploadImage}
                    className="flex-1"
                  />
                )}

                {uploading && progress2 < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full"
                      style={{ width: `${progress2}%` }}
                    ></div>
                  </div>
                )}

                {uploading && <Skeleton width="100%" height="300px"></Skeleton>}

                {videoForm.thumbnail && !uploading && (
                  <img
                    src={videoForm.thumbnail}
                    alt="thumbnail"
                    className="w-full h-[300px] object-cover mt-4"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="capitalize font-medium" htmlFor="video">
                Upload Video
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="file"
                    name="video"
                    id="video"
                    accept="video/*"
                    onChange={onUploadVideo}
                    className="flex-1"
                  />
                  {uploading2 && (
                    <p className="text-emerald-500 font-medium">
                      Uploading: {progress}%
                    </p>
                  )}
                </div>

                {uploading2 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                {uploading2 && (
                  <Skeleton width="100%" height="300px"></Skeleton>
                )}

                {videoForm.video && (
                  <video
                    muted
                    src={videoForm.video}
                    controls
                    className="w-full h-[300px] object-contain mt-4"
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        <Divider />

        <div className="flex items-center justify-end gap-3 ">
          <Button
            type="button"
            label="Discard"
            icon="pi pi-trash"
            severity="danger"
            onClick={onDiscard}
          />
          <Button
            type="button"
            label="Confirm Upload"
            loading={loading}
            disabled={loading}
            icon="pi pi-upload"
            severity="success"
            onClick={onCreateVideo}
          />
        </div>
      </form>
    </div>
  );
};

export default Upload;
