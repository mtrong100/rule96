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
      className="shadow-sm rounded-lg bg-[#1e1e1e] border border-zinc-700 hover:bg-zinc-800 cursor-pointer transition-all"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={onViewCount} className="relative">
        <video
          muted
          ref={videoRef}
          src={video?.video}
          className={`${
            isHovered ? "object-contain" : "object-cover"
          } rounded-tl-lg rounded-tr-lg h-[130px] md:h-[217px] w-full`}
          controls={false}
        />
        {!isHovered && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded ">
            {formatDuration(video?.duration)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-3 line-clamp-1 text-xs md:text-base">
          {video?.title}
        </h3>
        <div className="flex justify-between  text-gray-500">
          <div className="flex items-center gap-2 md:text-base text-xs">
            <i className="pi pi-eye md:text-base text-xs"></i>
            {video?.totalViews || 0} Views
          </div>
          <span className="md:text-base text-xs">
            {formatDate(video?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
