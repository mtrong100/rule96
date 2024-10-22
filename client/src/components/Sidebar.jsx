import React from "react";
import { Divider } from "primereact/divider";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { SIDEBAR_LINKS } from "../utils/constants";
import { Card } from "primereact/card";
import { logoutUserApi } from "../apis/userApi";
import { userStore } from "../zustand/userStore";
import toast from "react-hot-toast";
import { Button } from "primereact/button";

const Sidebar = () => {
  const location = useLocation();
  const setCurrentUser = userStore((state) => state.setCurrentUser);

  const onLogout = async () => {
    try {
      const response = await logoutUserApi();
      if (response) {
        setCurrentUser(null);
        toast.success(response.message);
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.log("Error logging out user", error);
      toast.error(error.message);
    }
  };

  return (
    <Card className="w-[300px] overflow-y-auto sticky top-0 left-0  border-right h-screen p-3 shadow-sm flex-shrink-0  z-10">
      <div className="text-center">
        <Logo />
      </div>
      <Divider />
      <ul className="space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const activeLink = location.pathname === link.link;

          return (
            <Link
              key={link.name}
              to={link.link}
              className={`${
                activeLink
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10 font-medium"
              } flex cursor-pointer items-center gap-3 px-5 rounded-md h-[45px] transition-all`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </ul>
      <Divider />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        severity="danger"
        className="w-full"
        onClick={onLogout}
      />
    </Card>
  );
};

export default Sidebar;
