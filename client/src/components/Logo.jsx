import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="text-4xl font-bold">
      Rule<strong className="text-purple-400">96</strong>Video
    </Link>
  );
};

export default Logo;
