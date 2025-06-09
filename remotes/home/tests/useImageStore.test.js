import { act } from 'react';
import { useImageStore } from '../stores/useImageStore';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ image: 'pic.jpg', alt: 'alt', title: 't', description: 'd' }])
  }));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('loadArticleImages stores fetched images', async () => {
  await act(async () => {
    await useImageStore.getState().loadArticleImages();
  });
  const images = useImageStore.getState().articleImages;
  expect(images.length).toBe(1);
  expect(images[0].title).toBe('t');
});
