import { create } from "zustand";

type TodoFilter = "all" | "active" | "completed";

type TodoFilterState = {
  filter: TodoFilter;
  setFilter: (value: TodoFilter) => void;
};

export const useTodoFilterStore = create<TodoFilterState>((set) => ({
  filter: "all",
  setFilter: (value: TodoFilter) => set({ filter: value }),
}));
