import { create } from "zustand";
import { withApiPath, useEnvStore } from "@anthonyv449/ui-kit";

export const useArticleStore = create((set, get) => ({
  articles: [],
  currentArticle: null,

  loadArticles: async () => {
    const url = withApiPath("/articles", "/articles/articles.json");
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    set({ articles: data });
  },

  loadArticle: async (currentSlug) => {
    const { apiPath } = useEnvStore.getState();
    if (apiPath) {
      const res = await fetch(withApiPath(`/articles/${currentSlug}`), {
        credentials: "include",
      });
      if (!res.ok) return;
      const article = await res.json();
      set({ currentArticle: article });
      return;
    }
  },

  getCurrentArticleBySlug: (slug) => {
    const currentArticle = get().articles.find((article) => article.Slug === slug);
    set({currentArticle})
  },

  createArticle: async (article) => {
    const { apiPath } = useEnvStore.getState();
    if (!apiPath) return;
    const res = await fetch(withApiPath("/articles"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
      credentials: "include",
    });
    if (!res.ok) return;
    let saved;
    try {
      saved = await res.json();
    } catch (e) {
      saved = article;
    }
    set((state) => ({ articles: [...state.articles, saved] }));
  },
}));
