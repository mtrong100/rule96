import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import {
  createdAtTemplate,
  userCmtTemplate,
  videoCmtTemplate,
} from "../utils/template";
import { deleteCommentApi, getCommentsApi } from "../apis/commentApi";

const CommentManage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getCommentsApi();
      if (response) setComments(response.results);
    } catch (error) {
      console.log("Failed to fetch comments:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCmts = comments.filter((tag) =>
    tag.content.toLowerCase().includes(debounceQuery.toLowerCase())
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
          const res = await deleteCommentApi(itemId);
          if (res)
            Swal.fire("Deleted!", "The data has been deleted.", "success");
        } catch (error) {
          console.log("An error occurred while deleting: ", error);
          Swal.fire("Error!", `${error.message}`, "error");
        } finally {
          fetchComments();
        }
      }
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onDelete(rowData._id)}
        />
      </div>
    );
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <DataTable
        value={filteredCmts}
        paginator
        rows={15}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows
        showGridlines
        header={
          <div className="p-inputgroup max-w-md ml-auto flex">
            <InputText
              placeholder="Search your comments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button icon="pi pi-search" />
          </div>
        }
      >
        <Column field="_id" header="ID" sortable />
        <Column field="video" header="Video" body={videoCmtTemplate} />
        <Column field="user" header="User" body={userCmtTemplate} />
        <Column field="content" header="content" sortable />
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

export default CommentManage;
