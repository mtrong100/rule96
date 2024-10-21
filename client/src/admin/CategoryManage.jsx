import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../apis/categoryApi";
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

const CategoryManage = () => {
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoriesApi();
      if (response) setCategories(response.results);
    } catch (error) {
      console.log("Failed to fetch categories:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const onCreateCategory = async () => {
    if (!form.name) return;
    try {
      const response = await createCategoryApi({
        name: form.name.toLowerCase().trim(),
        image: form.image,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to create category:", error);
      toast.error(error.message);
    } finally {
      setForm({ name: "", image: "" });
      fetchCategories();
    }
  };

  const onUpdateCategory = async () => {
    if (!form2.name) return;
    try {
      const response = await updateCategoryApi(details._id, {
        name: form2.name.toLowerCase().trim(),
        image: form2.image,
        status: form2.status,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to update category:", error);
      toast.error(error.message);
    } finally {
      fetchCategories();
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
          const res = await deleteCategoryApi(itemId);
          if (res)
            Swal.fire("Deleted!", "The data has been deleted.", "success");
        } catch (error) {
          console.log("An error occurred while deleting: ", error);
          Swal.fire("Error!", `${error.message}`, "error");
        } finally {
          fetchCategories();
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
            placeholder="Enter category name..."
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
            onClick={onCreateCategory}
            icon="pi pi-plus"
            label="Create new category"
          />
        </div>

        <div className="p-inputgroup max-w-md">
          <InputText
            placeholder="Search your categories..."
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
    fetchCategories();
  }, []);

  return (
    <div>
      <DataTable
        value={filteredCategories}
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
        <Column field="name" header="Category" sortable />
        <Column field="totalVideos" header="Total Videos" sortable />
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
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              placeholder="Enter cateogory name..."
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
            <Button label="Save" icon="pi pi-save" onClick={onUpdateCategory} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CategoryManage;
