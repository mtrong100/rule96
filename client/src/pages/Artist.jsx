import React, { useEffect, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { filterStore } from "../zustand/filterStore";
import { useNavigate } from "react-router-dom";

const Artist = () => {
  return <div>Artist</div>;
};

export default Artist;
