import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
  createdAtTemplate,
  status2Template,
  videoTemplate,
} from "../utils/template";
import {
  deleteVideoApi,
  getVideosApi,
  increaseViewCountApi,
  updateVideoApi,
} from "../apis/videoApi";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import useGetTags from "../hooks/useGetTags";
import useGetCategories from "../hooks/useGetCategories";
import useGetArtist from "../hooks/useGetArtist";

const VideoManage = () => {
  const navigate = useNavigate();
  const { tags, fetchTags } = useGetTags();
  const { categories, fetchCategories } = useGetCategories();
  const { artists, fetchArtist } = useGetArtist();
  const [visible, setVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: [],
    artist: "",
  });

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

  const filteredVideos = videos.filter((item) =>
    item.title.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const onUpdate = async () => {
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

    try {
      const response = await updateVideoApi(details._id, {
        ...videoForm,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to update video:", error);
      toast.error(error.message);
    } finally {
      fetchVideos();
      setVisible(false);
    }
  };

  const onDelete = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteVideoApi(itemId);
          if (res)
            Swal.fire("Deleted!", "The data has been deleted.", "success");
        } catch (error) {
          console.log("An error occurred while deleting: ", error);
          Swal.fire("Error!", `${error.message}`, "error");
        } finally {
          fetchVideos();
        }
      }
    });
  };

  const onViewCount = async (videoId) => {
    try {
      const response = await increaseViewCountApi(videoId);
      if (response) navigate(`/video/${videoId}`);
    } catch (error) {
      console.log("Error viewing video:", error);
      toast.error(error.message);
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          severity="info"
          icon="pi pi-eye"
          onClick={() => onViewCount(rowData._id)}
        />
        <Button
          severity="warning"
          icon="pi pi-pencil"
          onClick={() => {
            setVisible(true);
            setDetails(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onDelete(rowData._id)}
        />
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="p-inputgroup max-w-md flex ml-auto">
        <InputText
          placeholder="Search your videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button icon="pi pi-search" />
      </div>
    );
  };

  useEffect(() => {
    if (details) {
      setVideoForm({
        title: details.title,
        description: details.description,
        tags: details.tags,
        categories: details.categories,
        artist: details.artist._id,
      });
    }
  }, [details]);

  useEffect(() => {
    fetchTags();
    fetchCategories();
    fetchArtist();
    fetchVideos();
  }, []);

  return (
    <div>
      <DataTable
        value={filteredVideos}
        paginator
        rows={15}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows
        showGridlines
        header={headerTemplate}
      >
        <Column field="_id" header="ID" sortable />
        <Column field="video" header="Video" body={videoTemplate} />
        <Column
          field="title"
          header="Title"
          sortable
          style={{ width: "300px" }}
        />
        <Column field="artist.name" header="Artist" sortable />
        <Column
          field="status"
          header="Status"
          body={status2Template}
          sortable
        />
        <Column
          field="createdAt"
          header="Date added"
          sortable
          body={createdAtTemplate}
        />
        <Column body={actionTemplate} exportable={false} header="Action" />
      </DataTable>

      <Dialog
        header="Update category"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
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

          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="categories">
              select categories (limit 3)
            </label>
            <MultiSelect
              options={categories}
              placeholder="Select your categories..."
              optionLabel="name"
              optionValue="_id"
              filter
              filterPlaceholder="Search your categories..."
              scrollHeight="400px"
              maxSelectedLabels={3}
              value={videoForm.categories}
              onChange={(e) =>
                setVideoForm((prev) => ({
                  ...prev,
                  categories: e.value,
                }))
              }
            />
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
          </div>

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

          <div className="flex justify-end gap-2">
            <Button
              label="Close"
              severity="danger"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
            />
            <Button label="Save" icon="pi pi-save" onClick={onUpdate} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default VideoManage;
