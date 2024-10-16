import React, { useState, useRef } from "react";
import { formatDate, formatDuration } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { increaseViewCountApi } from "../apis/videoApi";

const VideoCard = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.muted = true; // Mute the video to allow autoplay
        videoRef.current.play();
      }
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to the start
    }
  };

  const onViewCount = async () => {
    try {
      const response = await increaseViewCountApi(video?._id);
      if (response) navigate(`/video/${video?._id}`);
    } catch (error) {
      console.log("Error viewing video:", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className="shadow-sm rounded-lg h-[315px] flex flex-col overflow-hidden "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={onViewCount} className="relative">
        <video
          muted
          ref={videoRef}
          src={video?.video}
          width="100%"
          height="100%"
          className="flex-1 object-cover rounded-tl-lg rounded-tr-lg"
          controls={false}
        />
        {!isHovered && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video?.duration)}
          </div>
        )}
      </div>
      <div className="p-4 bg-[#1e1e1e]">
        <h3 className="font-semibold mb-3">{video?.title}</h3>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="pi pi-eye"></i>
            {video?.totalViews || 0} Views
          </div>
          <span>{formatDate(video?.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
