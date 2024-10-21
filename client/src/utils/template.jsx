import { Tag } from "primereact/tag";
import { formatDate } from "./helper";
import noImage from "../assets/no-image.png";

export const createdAtTemplate = (rowData) => {
  return <div>{formatDate(rowData.createdAt)}</div>;
};

export const imageTemplate = (rowData) => {
  return (
    <img
      src={rowData.image || noImage}
      alt="Image"
      className="object-contain w-full h-[80px] rounded-lg"
    />
  );
};

export const statusTemplate = (rowData) => {
  return (
    <Tag
      value={rowData.status}
      severity={`${rowData.status === "Active" ? "success" : "danger"}`}
    />
  );
};

export const videoTemplate = (rowData) => {
  return (
    <video
      src={rowData.video}
      muted
      className="object-contain w-full h-[80px] rounded-lg"
    />
  );
};

export const categoriesTemplate = (rowData) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {rowData.categories.map((category) => {
        return (
          <Tag
            key={category._id}
            value={category.name}
            severity="info"
            className="capitalize"
          />
        );
      })}
    </div>
  );
};

export const tagsTemplate = (rowData) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {rowData.tags.map((tag) => {
        return (
          <Tag
            key={tag._id}
            value={tag.name}
            severity="warning"
            className="capitalize"
          />
        );
      })}
    </div>
  );
};

export const status2Template = (rowData) => {
  const severity =
    rowData.status === "Pending"
      ? "warning"
      : rowData.status === "Rejected"
      ? "danger"
      : "success";

  return <Tag value={rowData.status} severity={severity} />;
};
