import { loader } from '../index';
import { useImageStore } from '../stores/useImageStore';

test('loader calls loadArticleImages', async () => {
  const original = useImageStore.getState().loadArticleImages;
  const mock = jest.fn();
  useImageStore.setState({ loadArticleImages: mock });
  await loader();
  expect(mock).toHaveBeenCalled();
  useImageStore.setState({ loadArticleImages: original });
});
