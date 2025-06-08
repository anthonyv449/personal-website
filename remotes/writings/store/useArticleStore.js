import { create } from "zustand";
import { withBasePath } from "@anthonyv449/ui-kit";

export const useArticleStore = create((set) => ({
  articles: [],
  currentArticle: null,

  loadArticles: async () => {
    const res = await fetch(withBasePath("/articles/articles.json")); // or wherever your index lives
    const data = await res.json();
    set({ articles: data });
  },

  loadArticle: async (currentSlug) => {
    const res = await fetch(withBasePath("/articles/articles.json")); // or wherever your index lives
    const data = await res.json();
    const article = data.find((d) => d.slug === currentSlug);
    const articleReponse = await fetch(withBasePath(article.file));
    const articleText = await articleReponse.text();
    set({ currentArticle: { ...article, articleText } });
  },

  getArticleBySlug: (slug) => {
    return get().articles.find((article) => article.slug === slug);
  },
}));
