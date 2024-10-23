import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <Card>
      <div className="text-center md:py-5">
        <Logo />

        <p className="my-3 text-sm  md:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
          odio dignissimos aliquid sunt ipsum. <br /> Mollitia rerum non numquam
          blanditiis, corporis ipsa quibusdam,
        </p>

        <span>2024 © Rule96 - All rights reserved</span>
      </div>
    </Card>
  );
};

export default Footer;
