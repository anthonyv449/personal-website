import { render, screen } from '@testing-library/react';
import Footer from '../src/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderFooter = () => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <Footer />
    </ThemeProvider>
  );
};

test('displays latest release text', () => {
  renderFooter();
  expect(screen.getByText(/latest release/i)).toBeInTheDocument();
});
