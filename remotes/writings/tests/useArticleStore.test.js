import { act } from 'react';
import { useArticleStore } from '../store/useArticleStore';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('articles.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { slug: 'one', file: '/file.md', title: 't', summary: 's' },
        ]),
      });
    }
    return Promise.resolve({ ok: true, text: () => Promise.resolve('text') });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('loadArticles stores articles', async () => {
  await act(async () => {
    await useArticleStore.getState().loadArticles();
  });
  const articles = useArticleStore.getState().articles;
  expect(articles.length).toBe(1);
});

test('loadArticle loads current article', async () => {
  await act(async () => {
    await useArticleStore.getState().loadArticle('one');
  });
  const article = useArticleStore.getState().currentArticle;
  expect(article.slug).toBe('one');
  expect(article.articleText).toBe('text');
});
