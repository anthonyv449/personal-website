import { create } from "zustand";
import { withApiPath, useEnvStore } from "@anthonyv449/ui-kit";

export const useArticleStore = create((set, get) => ({
  articles: [],
  currentArticle: null,

  loadArticles: async () => {
    const url = withApiPath("/articles", "/articles/articles.json");
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    set({ articles: data });
  },

  loadArticle: async (currentSlug) => {
    const { apiPath } = useEnvStore.getState();
    if (apiPath) {
      const res = await fetch(withApiPath(`/articles/${currentSlug}`));
      if (!res.ok) return;
      const article = await res.json();
      set({ currentArticle: article });
      return;
    }
  },

  getArticleBySlug: (slug) => {
    return get().articles.find((article) => article.slug === slug);
  },
}));
