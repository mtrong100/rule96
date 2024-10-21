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
  categoriesTemplate,
  createdAtTemplate,
  status2Template,
  tagsTemplate,
  videoTemplate,
} from "../utils/template";
import { deleteVideoApi, getVideosApi } from "../apis/videoApi";

const VideoManage = () => {
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

  // const onUpdate = async () => {
  //   if (!form2.name) return;
  //   try {
  //     const response = await updateCategoryApi(details._id, {
  //       name: form2.name.toLowerCase().trim(),
  //       image: form2.image,
  //       status: form2.status,
  //     });
  //     if (response) toast.success(response.message);
  //   } catch (error) {
  //     console.log("Failed to update category:", error);
  //     toast.error(error.message);
  //   } finally {
  //     fetchCategories();
  //     setVisible(false);
  //   }
  // };

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

  const actionTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
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
    </div>
  );
};

export default VideoManage;
