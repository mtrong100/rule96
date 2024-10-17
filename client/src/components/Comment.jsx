import React from "react";
import { formatDate } from "../utils/helper";
import { userStore } from "../zustand/userStore";

const Comment = ({ cmt, onDelete, loading }) => {
  const currentUser = userStore((state) => state.currentUser);

  return (
    <div className="flex items-start space-x-4 p-4 bg-zinc-800 rounded-lg shadow-sm">
      <img
        src={cmt?.user?.avatar}
        alt={cmt?.user?.username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-white">{cmt?.user?.username}</h4>
          <small>{formatDate(cmt?.createdAt)}</small>
        </div>
        <p className="text-gray-400 my-2">{cmt?.content}</p>
        {currentUser?._id === cmt?.user?._id && (
          <button
            disabled={loading}
            onClick={() => onDelete(cmt?._id)}
            className="text-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Comment;
