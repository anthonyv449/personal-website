import { create } from "zustand";

export const useArticleStore = create((set) => ({
  articles: [],

  loadArticles: async () => {
    const res = await fetch("/articles/articles.json"); // or wherever your index lives
    const data = await res.json();
    set({ articles: data });
  },

  getArticleBySlug: (slug) => {
    return get().articles.find((article) => article.slug === slug);
  },
}));
