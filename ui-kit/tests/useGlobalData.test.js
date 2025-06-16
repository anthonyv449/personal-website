import { useGlobalData } from '../hooks/useGlobalData';
import { useEnvStore } from '../hooks/useEnv';

beforeEach(() => {
  useGlobalData.setState({ user: null });
  useEnvStore.setState({ apiPath: null });
});

afterEach(() => {
  jest.resetAllMocks();
  delete global.fetch;
});

test('loadUser does nothing when apiPath not set', async () => {
  global.fetch = jest.fn();
  await useGlobalData.getState().loadUser();
  expect(global.fetch).not.toHaveBeenCalled();
  expect(useGlobalData.getState().user).toBeNull();
});

test('loadUser fetches and sets user when apiPath is set', async () => {
  useEnvStore.setState({ apiPath: 'https://api.test.com' });
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ name: 'tester' }) }));
  await useGlobalData.getState().loadUser();
  expect(global.fetch).toHaveBeenCalledWith('https://api.test.com/auth/me', { credentials: 'include' });
  expect(useGlobalData.getState().user).toEqual({ name: 'tester' });
});

test('logoutUser posts to api and clears user', async () => {
  useEnvStore.setState({ apiPath: 'https://api.test.com' });
  useGlobalData.setState({ user: { name: 'tester' } });
  global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  await useGlobalData.getState().logoutUser();
  expect(global.fetch).toHaveBeenCalledWith('https://api.test.com/auth/logout', { method: 'POST', credentials: 'include' });
  expect(useGlobalData.getState().user).toBeNull();
});

test('logoutUser does nothing if apiPath not set', async () => {
  useEnvStore.setState({ apiPath: null });
  useGlobalData.setState({ user: { name: 'tester' } });
  global.fetch = jest.fn();
  await useGlobalData.getState().logoutUser();
  expect(global.fetch).not.toHaveBeenCalled();
  expect(useGlobalData.getState().user).toEqual({ name: 'tester' });
});
