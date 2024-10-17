import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Logo from "./Logo";
import { userStore } from "../zustand/userStore";

const Header = () => {
  const currentUser = userStore((state) => state.currentUser);

  return (
    <Card className="z-50 sticky top-0">
      <div className="mx-auto max-w-[1300px] px-5 w-full">
        <div className="grid grid-cols-3 items-center">
          <Logo />

          <ul className="flex items-center gap-5">
            <Link to="/tag">
              <Button label="Tags" icon="pi pi-tag" />
            </Link>
            <Link to="/category">
              <Button label="Categories" icon="pi pi-objects-column" />
            </Link>
          </ul>

          {currentUser ? (
            <div className="flex justify-end items-center gap-3">
              <Link to="/upload">
                <Button label="Upload" icon="pi pi-upload" severity="success" />
              </Link>
              <Link to="/profile">
                <Button label="Profile" icon="pi pi-user" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-end">
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
  );
};

export default Header;
