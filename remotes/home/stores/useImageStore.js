// src/stores/useImageStore.js
import { create } from "zustand";

export const useImageStore = create((set) => ({
  articleImages: [],
  loadArticleImages: async () => {
    try {
      const response = await fetch("/GradImages/articleImages.json");
      if (!response.ok) {
        throw new Error("Failed to fetch image data");
      }

      const data = await response.json();
      const adjustedData = data.map((item) => ({
        ...item,
        image: item.image.startsWith("/")
          ? item.image
          : `/GradImages/${item.image}`,
      }));

      set({ articleImages: adjustedData });
    } catch (error) {
      console.error("Error loading images:", error);
    }
  },
}));
