import { create } from "zustand";
import { withHostPath, withApiPath, useEnvStore } from "@anthonyv449/ui-kit";

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

    const res = await fetch(withHostPath("/articles/articles.json"));
    const data = await res.json();
    const article = data.find((d) => d.slug === currentSlug);
    const articleReponse = await fetch(withHostPath(article.file));
    const articleText = await articleReponse.text();
    set({ currentArticle: { ...article, articleText } });
  },

  getArticleBySlug: (slug) => {
    return get().articles.find((article) => article.slug === slug);
  },
}));
