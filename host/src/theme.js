import { createTheme } from "@mui/material/styles";

// Define the MUI theme
const customColors = {
  mainTextColor: "#b4b4b4",
};

const theme = createTheme({
  palette: {
    primary: {
      main: customColors.mainTextColor,
    },
    secondary: {
      main: "#d32f2f", // Red color
    },
    background: {
      default: "#111210",
    },
  },
  typography: {
    h6: {
      color: customColors.mainTextColor,
      fontWeight: 600,
      fontSize: "1.25rem",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
        },
      },
    },
  },
});

export default theme;
