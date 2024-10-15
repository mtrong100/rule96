import React from "react";
import { Card } from "primereact/card";
import { formatDate } from "../utils/helper";

const VideoCard = ({ title, videoUrl, views, uploadDate }) => {
  return (
    <div className="shadow-sm rounded-lg h-[315px] flex flex-col overflow-hidden">
      <video
        src={videoUrl}
        width="100%"
        height="100%"
        className="flex-1 object-cover rounded-tl-lg rounded-tr-lg"
      />
      <div className="p-4 bg-[#1e1e1e]">
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="pi pi-eye"></i>
            {views} Views
          </div>
          <span>{formatDate(uploadDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
