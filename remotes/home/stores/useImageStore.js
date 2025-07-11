// src/stores/useImageStore.js
import { create } from "zustand";
import { withHostPath } from "@anthonyv449/ui-kit";

export const useImageStore = create((set) => ({
  articleImages: [],
  loadArticleImages: async () => {
    try {
      const response = await fetch(withHostPath("/images/articleImages.json"));
      if (!response.ok) {
        throw new Error("Failed to fetch image data");
      }

      const data = await response.json();
      const adjustedData = data.map((item) => ({
        ...item,
        image: item.image.startsWith("/")
          ? item.image
          : withHostPath(`/images/${item.image}`),
      }));

      set({ articleImages: adjustedData });
      console.log(adjustedData);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  },
}));
