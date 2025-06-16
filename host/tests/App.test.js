import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { act } from 'react';

jest.mock('../src/msalConfig', () => ({ msalInstance: {} }));
jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }) => <>{children}</>,
  useMsal: () => ({ instance: { loginPopup: jest.fn(), logoutPopup: jest.fn() }, accounts: [] })
}));

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === '/content.json') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ pages: [] }) });
    }
    if (url === '/remotes.json') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([{ name: 'home', port: 3001 }]) });
    }
    if (url.includes('remoteEntry.js')) {
      return Promise.resolve({ ok: true, headers: { get: () => 'Wed, 21 Oct 2015 07:28:00 GMT' } });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.resetAllMocks();
  delete global.fetch;
});

test('renders loading initially then shows navbar', async () => {
  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
});
