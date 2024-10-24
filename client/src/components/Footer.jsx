import { Card } from "primereact/card";
import Logo from "./Logo";

const Footer = () => {
  return (
    <Card className="mt-auto">
      <div className="text-center md:py-5">
        <Logo />

        <p className="my-3 text-xs md:text-base">
          All models were 18 years of age or older at the time of depiction.
          Rule96Video has a zero-tolerance policy against illegal pornography.
        </p>

        <span className="text-xs md:text-base">
          2024 © Rule96 - All rights reserved
        </span>
      </div>
    </Card>
  );
};

export default Footer;
