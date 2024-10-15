import React from "react";
import { Card } from "primereact/card";

const VideoCard = ({ title, thumbnail, views, uploadDate }) => {
  return (
    <Card className="shadow-sm rounded-lg overflow-hidden">
      <img src={thumbnail} alt={title} className="w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="pi pi-eye "></i>
            {views} views
          </div>
          <span>{uploadDate}</span>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
