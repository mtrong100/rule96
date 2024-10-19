import React from "react";
import Anime from "../assets/anime.png";

const Empty = ({ className = "", text = "Sorry no videos found..." }) => {
  return (
    <div
      className={`${className} my-20 flex flex-col items-center gap-3  animate-pulse`}
    >
      <img src={Anime} alt="anime" className="w-[350px] h-[350px]" />
      <h1 className="text-3xl pacity-50 text-center font-semibold">{text}</h1>
    </div>
  );
};

export default Empty;
