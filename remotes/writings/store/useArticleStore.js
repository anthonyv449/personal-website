import { create } from "zustand";
import { withApiPath, useEnvStore } from "@anthonyv449/ui-kit";
import { useGlobalData } from "@anthonyv449/ui-kit";

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
      return article;
    }
  },

  setCurrentArticleBySlug: (slug) => {
    const currentArticle = get().articles.find(
      (article) => article.Slug === slug
    );
    set({ currentArticle });
    return currentArticle;
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

  postArticleView: async (article) => {
    const { apiPath } = useEnvStore.getState();
    if (!apiPath) return;
    const { user } = useGlobalData.getState();
    const userId = user?.Id ?? 0;
    console.log(article);
    const res = await fetch(withApiPath(`/articles/viewed`), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        ArticleId: article.ArticleId,
        ViewerId: userId.toString(),
        ViewedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error("Failed to post article view");
      return;
    }
  },
}));
