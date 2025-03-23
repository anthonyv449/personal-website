// useResumeStore.js
import { create } from "zustand";

export const useResumeStore = create((set) => ({
  resumeMarkdown: "",
  loading: false,
  error: null,
  fetchResume: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/resume.md");
      if (!res.ok) throw new Error("Failed to load resume.md");
      const text = await res.text();
      set({ resumeMarkdown: text, loading: false });
    } catch (error) {
      console.error("Error fetching resume.md:", error);
      set({ error: error.message, loading: false });
    }
  },
}));
