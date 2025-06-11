import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../src/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMsal } from '@azure/msal-react';

jest.mock('@azure/msal-react');

const renderNavbar = (props) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <Navbar {...props} />
    </ThemeProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders login button when no user', () => {
  useMsal.mockReturnValue({ instance: { loginPopup: jest.fn(), logoutPopup: jest.fn() }, accounts: [] });
  renderNavbar({ pages: [] });
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});

test('calls login on button click', () => {
  const loginPopup = jest.fn().mockResolvedValue();
  useMsal.mockReturnValue({ instance: { loginPopup, logoutPopup: jest.fn() }, accounts: [] });
  renderNavbar({ pages: [] });
  fireEvent.click(screen.getByText(/sign in/i));
  expect(loginPopup).toHaveBeenCalled();
});

test('shows logout when user logged in', () => {
  const logoutPopup = jest.fn();
  useMsal.mockReturnValue({ instance: { loginPopup: jest.fn(), logoutPopup }, accounts: [{ name: 'Tester' }] });
  renderNavbar({ pages: [] });
  expect(screen.getByText(/logout/i)).toBeInTheDocument();
});
