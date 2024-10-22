import React from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

const CardCount = ({ icon, count, title }) => {
  return (
    <Card>
      <div className="flex items-center justify-between px-5">
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-3xl font-semibold capitalize">{title}</h1>
          <Badge value={count || 0} size="xlarge" />
        </div>
        <i className={`pi ${icon} text-6xl`}></i>
      </div>
    </Card>
  );
};

export default CardCount;
