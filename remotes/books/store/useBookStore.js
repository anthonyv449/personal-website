import { create } from "zustand";
import { withApiPath } from "@anthonyv449/ui-kit";

export const useBookStore = create((set, get) => ({
  books: [],
  currentIndex: 0,
  error: false,
  empty: false,

  loadBooks: async () => {
    try {
      const url = withApiPath("/books");
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 204) {
        set({ empty: true });
        return;
      }
      if (!res.ok) {
        set({ error: true });
        return;
      }
      const data = await res.json();
      set({ books: data, currentIndex: 0 });
    } catch {
      set({ error: true });
    }
  },

  nextBook: () => {
    const { books, currentIndex } = get();
    if (books.length === 0) return;
    set({ currentIndex: (currentIndex + 1) % books.length });
  },

  prevBook: () => {
    const { books, currentIndex } = get();
    if (books.length === 0) return;
    set({ currentIndex: (currentIndex - 1 + books.length) % books.length });
  },
}));
