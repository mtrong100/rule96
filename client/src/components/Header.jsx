import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Logo from "./Logo";
import { userStore } from "../zustand/userStore";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { Divider } from "primereact/divider";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const currentUser = userStore((state) => state.currentUser);

  return (
    <>
      <Card className="z-50 sticky top-0">
        <div className="mx-auto max-w-[1300px] px-5 w-full">
          <div className="grid-cols-2 grid lg:grid-cols-3 items-center">
            <Logo />

            <ul className="items-center gap-3 hidden lg:flex">
              <Link to="/tag">
                <Button label="Tags" icon="pi pi-tag" />
              </Link>
              <Link to="/category">
                <Button label="Categories" icon="pi pi-objects-column" />
              </Link>
              <Link to="/artist">
                <Button label="Artists" icon="pi pi-user-edit" />
              </Link>
            </ul>

            <Button
              icon="pi pi-bars"
              className="w-[45px] h-[45px] flex ml-auto md:hidden"
              severity="warning"
              onClick={() => setVisible(true)}
            />

            {currentUser ? (
              <div className="hidden md:flex justify-end items-center gap-3">
                <Link to="/upload">
                  <Button
                    label="Upload"
                    icon="pi pi-upload"
                    severity="success"
                  />
                </Link>
                <Link to="/profile">
                  <Button label="Profile" icon="pi pi-user" />
                </Link>
                <Button
                  icon="pi pi-bars"
                  className="w-[45px] h-[45px] hidden md:flex lg:hidden"
                  severity="warning"
                  onClick={() => setVisible(true)}
                />
              </div>
            ) : (
              <div className="items-center gap-3 justify-end hidden md:flex">
                <Link to="/sign-in">
                  <Button label="Login" severity="info" />
                </Link>
                <Link to="/sign-up">
                  <Button label="Register" severity="secondary" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Sidebar
        position="right"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <div className="text-center">
          <Logo />
        </div>
        <Divider />
        <ul className="flex flex-col gap-3 items-stretch">
          <Link to="/tag">
            <Button label="Tags" icon="pi pi-tag" className="w-full" />
          </Link>
          <Link to="/category">
            <Button
              label="Categories"
              icon="pi pi-objects-column"
              className="w-full"
            />
          </Link>
          <Link to="/artist">
            <Button label="Artists" icon="pi pi-user-edit" className="w-full" />
          </Link>
        </ul>
        <Divider />
        <ul className="flex flex-col gap-3 items-stretch">
          {currentUser ? (
            <>
              <Link to="/upload">
                <Button
                  label="Upload"
                  icon="pi pi-upload"
                  severity="success"
                  className="w-full"
                />
              </Link>
              <Link to="/profile">
                <Button
                  label="Profile"
                  icon="pi pi-user"
                  className="w-full"
                  severity="info"
                />
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button label="Login" severity="info" className="w-full" />
              </Link>
              <Link to="/sign-up">
                <Button
                  label="Register"
                  severity="secondary"
                  className="w-full"
                />
              </Link>
            </>
          )}
        </ul>
      </Sidebar>
    </>
  );
};

export default Header;
