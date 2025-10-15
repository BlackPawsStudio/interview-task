"use client";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type FilterState = {
  coordinates: [number, number][][];
};

export type FilterActions = {
  setCoordinates: (coordinates: [number, number][][]) => void;
};

export type FilterStore = FilterState & FilterActions;

export const defaultInitState: FilterState = {
  coordinates: [],
};

export const createFilterStore = (
  initState: FilterState = defaultInitState
) => {
  return createStore<FilterStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setCoordinates: (coordinates) => set({ coordinates }),
      }),
      {
        name: "filter-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};
