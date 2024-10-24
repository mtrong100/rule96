import React from "react";
import Anime from "../assets/anime.png";

const Empty = ({ className = "" }) => {
  return (
    <div
      className={`${className} flex flex-col items-center gap-3 animate-pulse my-20`}
    >
      <img
        src={Anime}
        alt="anime"
        className="md:w-[350px] md:h-[350px] w-[200px] h-[200px]"
      />
      <h1 className=" text-2xl md:text-3xl pacity-50 text-center font-semibold">
        Sorry not found...
      </h1>
    </div>
  );
};

export default Empty;
