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
  avatarTemplate,
  createdAtTemplate,
  roleTemplate,
} from "../utils/template";
import { deleteUserApi, getUsersApi, updateUserApi } from "../apis/userApi";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersApi();
      if (response) setUsers(response.results);
    } catch (error) {
      console.log("Failed to fetch users:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(debounceQuery.toLowerCase())
  );

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
          const res = await deleteUserApi(itemId);
          if (res)
            Swal.fire("Deleted!", "The data has been deleted.", "success");
        } catch (error) {
          console.log("An error occurred while deleting: ", error);
          Swal.fire("Error!", `${error.message}`, "error");
        } finally {
          fetchUsers();
        }
      }
    });
  };

  const onUpdate = async () => {
    if (!form.username) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);

    try {
      const response = await updateUserApi(details._id, { ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Failed to update user:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setVisible(false);
      fetchUsers();
    }
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

  useEffect(() => {
    if (details) {
      setForm({
        avatar: details.avatar,
        username: details.username,
        gender: details.gender,
        age: details.age,
        city: details.city,
        country: details.country,
        relationshipStatus: details.relationshipStatus,
        about: details.about,
      });
    }
  }, [details]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <DataTable
        value={filteredUsers}
        paginator
        rows={15}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows
        showGridlines
        header={
          <div className="p-inputgroup max-w-md flex ml-auto">
            <InputText
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button icon="pi pi-search" />
          </div>
        }
      >
        <Column field="_id" header="ID" sortable />
        <Column field="avatar" header="Avatar" body={avatarTemplate} />
        <Column field="username" header="Username" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="gender" header="Gender" sortable />
        <Column field="country" header="Country" sortable />
        <Column field="age" header="Age" sortable />
        <Column field="city" header="City" sortable />
        <Column field="role" header="Role" sortable body={roleTemplate} />
        <Column
          field="relationshipStatus"
          header="Relationship Status"
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
        header="Update user profile"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <form className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="capitalize" htmlFor="avatar">
              avatar link
            </label>
            <InputText
              id="avatar"
              placeholder="Enter your avatar link..."
              value={form.avatar}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, avatar: e.target.value }))
              }
            />
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
            onClick={onUpdate}
          />
        </form>
      </Dialog>
    </div>
  );
};

export default UserManage;
