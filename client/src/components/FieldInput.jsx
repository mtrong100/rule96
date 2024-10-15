import React from "react";
import { InputText } from "primereact/inputtext";

const FieldInput = ({ label, register, name, errorMessage, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="capitalize" htmlFor={label}>
        {label}
      </label>
      <InputText id={label} {...register(`${name}`)} {...props} />
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default FieldInput;
