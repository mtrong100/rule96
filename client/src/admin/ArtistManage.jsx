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
  imageTemplate,
  statusTemplate,
} from "../utils/template";
import {
  createArtistApi,
  deleteArtistApi,
  getArtistsApi,
  updateArtistApi,
} from "../apis/artistApi";

const ArtistManage = () => {
  const [visible, setVisible] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
  });
  const [form2, setForm2] = useState({
    name: "",
    image: "",
    status: "Active",
  });

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await getArtistsApi();
      if (response) setArtists(response.results);
    } catch (error) {
      console.log("Failed to fetch artists:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const onCreateArtist = async () => {
    if (!form.name) return;
    try {
      const response = await createArtistApi({
        name: form.name.toLowerCase().trim(),
        image: form.image,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create category:", error);
      toast.error(error.message);
    } finally {
      setForm({ name: "", image: "" });
      fetchArtists();
    }
  };

  const onUpdateArtist = async () => {
    if (!form2.name) return;
    try {
      const response = await updateArtistApi(details._id, {
        name: form2.name.toLowerCase().trim(),
        image: form2.image,
        status: form2.status,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to update category:", error);
      toast.error(error.message);
    } finally {
      fetchArtists();
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
          const res = await deleteArtistApi(itemId);
          if (res)
            Swal.fire("Deleted!", "The data has been deleted.", "success");
        } catch (error) {
          console.log("An error occurred while deleting: ", error);
          Swal.fire("Error!", `${error.message}`, "error");
        } finally {
          fetchArtists();
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
      <section className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-3 w-full max-w-4xl">
          <InputText
            placeholder="Enter artist name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full"
          />
          <InputText
            placeholder="Enter image link..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full"
          />
          <Button
            onClick={onCreateArtist}
            icon="pi pi-plus"
            label="Create new artist"
          />
        </div>

        <div className="p-inputgroup max-w-md">
          <InputText
            placeholder="Search your artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button icon="pi pi-search" />
        </div>
      </section>
    );
  };

  useEffect(() => {
    if (details) {
      setForm2({
        name: details.name,
        image: details.image,
        status: details.status,
      });
    }
  }, [details]);

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div>
      <DataTable
        value={filteredArtists}
        paginator
        rows={15}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows
        showGridlines
        header={headerTemplate}
      >
        <Column field="_id" header="ID" sortable />
        <Column field="image" header="Image" body={imageTemplate} />
        <Column field="name" header="Artist" sortable />
        <Column field="status" header="Status" body={statusTemplate} sortable />
        <Column
          field="createdAt"
          header="Date added"
          sortable
          body={createdAtTemplate}
        />
        <Column body={actionTemplate} exportable={false} header="Action" />
      </DataTable>

      <Dialog
        header="Update Artist"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              placeholder="Enter artist name..."
              value={form2.name}
              onChange={(e) => setForm2({ ...form2, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image">Image Link</label>
            <InputText
              id="image"
              placeholder="Enter image link..."
              value={form2.image}
              onChange={(e) => setForm2({ ...form2, image: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status">Status</label>
            <Dropdown
              options={["Active", "Inactive"]}
              placeholder="Select status..."
              value={form2.status}
              onChange={(e) => setForm2({ ...form2, status: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Close"
              severity="danger"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
            />
            <Button label="Save" icon="pi pi-save" onClick={onUpdateArtist} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ArtistManage;
