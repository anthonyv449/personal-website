import { useEnvStore, withHostPath, withRemotesPath, withApiPath, DEFAULT_DOMAIN, HOST_PATH } from '../hooks/useEnv';

beforeEach(() => {
  // reset store state before each test
  useEnvStore.setState({
    domain: DEFAULT_DOMAIN,
    hostPath: HOST_PATH,
    loaded: false,
    apiPath: null,
  });
});

afterEach(() => {
  jest.resetAllMocks();
  delete global.fetch;
});

test('withHostPath builds url with domain and hostPath', () => {
  useEnvStore.setState({ domain: 'https://cdn.test.com', hostPath: '/host' });
  expect(withHostPath('/file.json')).toBe('https://cdn.test.com/host/file.json');
});

test('withRemotesPath builds url under remotes path', () => {
  useEnvStore.setState({ domain: 'https://cdn.test.com' });
  expect(withRemotesPath('home/remoteEntry.js')).toBe('https://cdn.test.com/remotes/home/remoteEntry.js');
});

test('withApiPath prefers apiPath when set', () => {
  useEnvStore.setState({ domain: 'https://cdn.test.com', hostPath: '/host', apiPath: 'https://api.test.com' });
  expect(withApiPath('/articles', '/articles/articles.json')).toBe('https://api.test.com/articles');
});

test('withApiPath falls back to host path when apiPath not set', () => {
  useEnvStore.setState({ domain: 'https://cdn.test.com', hostPath: '/host', apiPath: null });
  expect(withApiPath('/articles', '/articles/articles.json')).toBe('https://cdn.test.com/host/articles/articles.json');
});

test('loadEnv fetches env.json and updates store', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ domain: 'https://cdn.example.com', hostPath: '/h', apiPath: 'https://api.example.com' })
  }));
  await useEnvStore.getState().loadEnv();
  const state = useEnvStore.getState();
  expect(state.domain).toBe('https://cdn.example.com');
  expect(state.hostPath).toBe('/h');
  expect(state.apiPath).toBe('https://api.example.com');
  expect(state.loaded).toBe(true);
});
