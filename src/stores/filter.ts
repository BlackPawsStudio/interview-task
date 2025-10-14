"use client";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { Home } from "@/types/home";
import allHomes from "@/../public/1000_homes.json";

export type FilterState = {
  filteredHomes: Home[];
  coordinates: [number, number][][];
};

export type FilterActions = {
  setFilteredHomes: (filteredHomes: Home[]) => void;
  setCoordinates: (coordinates: [number, number][][]) => void;
};

export type FilterStore = FilterState & FilterActions;

export const defaultInitState: FilterState = {
  filteredHomes: [],
  coordinates: [],
};

export const createFilterStore = (
  initState: FilterState = defaultInitState
) => {
  return createStore<FilterStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setFilteredHomes: (filteredHomes) => set({ filteredHomes }),
        setCoordinates: (coordinates) => set({ coordinates }),
      }),
      {
        name: "filter-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};
