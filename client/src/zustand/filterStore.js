import { create } from "zustand";

export const filterStore = create((set) => ({
  filter: {
    title: "",
    category: "",
    tag: "",
    dateFilter: "",
  },
  setFilter: (filter) => set({ filter }),
  clearFilter: () =>
    set({ filter: { title: "", category: "", tag: "", dateFilter: "" } }),
}));
