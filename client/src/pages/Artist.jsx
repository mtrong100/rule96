import React, { useEffect, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import useDebounce from "../hooks/useDebounce";
import { filterStore } from "../zustand/filterStore";
import { useNavigate } from "react-router-dom";
import useGetArtist from "../hooks/useGetArtist";
import noImage from "../assets/no-image.png";
import Empty from "../components/Empty";

const Artist = () => {
  const navigate = useNavigate();
  const setFilter = filterStore((state) => state.setFilter);
  const { artists, loading, fetchArtist } = useGetArtist();
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(debounceQuery.toLowerCase())
  );

  const onSelectArtist = (id) => {
    if (!id) return;
    setFilter({ artist: id });
    navigate("/");
  };

  // FIX SCROLL BUG
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    fetchArtist();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-bold">
        Total Artists ({artists.length || 0})
      </h1>

      <div className="mt-3 md:mt-5">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search your artist..."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </IconField>
      </div>

      {!loading && filteredArtists.length === 0 && <Empty />}

      <ul className="items-center flex flex-wrap gap-2 mt-5">
        {filteredArtists.map((item) => (
          <li key={item?._id}>
            <Chip
              onClick={() => onSelectArtist(item?._id)}
              label={`${item?.name} (${item?.totalVideos || 0})`}
              image={item?.image || noImage}
              className="hover:bg-zinc-700 cursor-pointer md:text-base text-xs"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Artist;
