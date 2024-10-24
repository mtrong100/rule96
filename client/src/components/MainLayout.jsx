import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ButtonScrollTop from "./ButtonScrollTop";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
      <ButtonScrollTop />
    </div>
  );
};

export default MainLayout;
