import { act } from 'react';
import { useArticleStore } from '../store/useArticleStore';
import { useEnvStore } from '../../../ui-kit/hooks/useEnv';

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
    if (url.includes('/articles/') ) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ slug: 'one', articleText: 'text' }),
      });
    }
    if (url.includes('/articles')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { slug: 'one', title: 't', summary: 's', file: '/file.md' },
        ]),
      });
    }
    return Promise.resolve({ ok: true, text: () => Promise.resolve('text') });
  });
  useEnvStore.setState({ apiPath: "https://api.test.com" });
});

afterEach(() => {
  jest.resetAllMocks();
  useEnvStore.setState({ apiPath: null });
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

test('createArticle posts article', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          title: 'My First Article',
          content: 'Hello world',
          author: 'codex',
          slug: 'test',
        }),
    })
  );
  const article = {
    title: 'My First Article',
    content: 'Hello world',
    author: 'codex',
    slug: 'test',
  };
  await act(async () => {
    await useArticleStore.getState().createArticle(article);
  });
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/articles'),
    expect.objectContaining({ method: 'POST' })
  );
  const articles = useArticleStore.getState().articles;
  expect(articles[articles.length - 1].slug).toBe('test');
});
