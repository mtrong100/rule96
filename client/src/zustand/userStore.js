import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userStore = create(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "currentUser-storage",
      getStorage: () => localStorage,
    }
  )
);
