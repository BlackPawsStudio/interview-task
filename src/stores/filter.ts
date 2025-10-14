// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type FilterState = {
  count: number;
};

export type FilterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
};

export type FilterStore = FilterState & FilterActions;

export const defaultInitState: FilterState = {
  count: 0,
};

export const createFilterStore = (
  initState: FilterState = defaultInitState
) => {
  return createStore<FilterStore>()(
    persist(
      (set, get) => ({
        ...initState,
        decrementCount: () => set((state) => ({ count: state.count - 1 })),
        incrementCount: () => set((state) => ({ count: state.count + 1 })),
      }),
      {
        name: "filter-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};
