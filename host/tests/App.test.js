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
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders loading initially then shows navbar', async () => {
  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
});
