import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

const FieldTextarea = ({ label, register, name, errorMessage, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="capitalize" htmlFor={label}>
        {label}
      </label>
      <InputTextarea
        id={label}
        rows={4}
        cols={30}
        {...register(`${name}`)}
        {...props}
      />
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default FieldTextarea;
