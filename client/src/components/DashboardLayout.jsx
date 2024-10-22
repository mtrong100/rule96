import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { userStore } from "../zustand/userStore";
import { Navigate } from "react-router-dom";

const DashboardLayout = () => {
  const currentUser = userStore((state) => state.currentUser);

  if (currentUser.role !== "Admin") {
    return <Navigate to="/sign-in" />;
  }

  return (
    <section className="relative flex items-start">
      <Sidebar />
      <main className="p-5 w-full overflow-hidden">
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
