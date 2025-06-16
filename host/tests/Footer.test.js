import { render, screen } from '@testing-library/react';
import Footer from '../src/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderFooter = (props) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <Footer {...props} />
    </ThemeProvider>
  );
};

test('displays latest release text', () => {
  renderFooter({ latestDate: new Date('2020-01-01') });
  expect(screen.getByText(/latest release/i)).toBeInTheDocument();
});
