import { loader } from '../index';
import { useArticleStore } from '../store/useArticleStore';

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

test('loader calls loadArticles', async () => {
  const original = useArticleStore.getState().loadArticles;
  const mock = jest.fn();
  useArticleStore.setState({ loadArticles: mock });
  await loader();
  expect(mock).toHaveBeenCalled();
  useArticleStore.setState({ loadArticles: original });
});
