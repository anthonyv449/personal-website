import { createTheme } from "@mui/material/styles";

// Define the MUI theme
const customColors = {
  mainTextColor: "#b4b4b4",
  mainBackgroundColor: "#111210",
};

const theme = createTheme({
  palette: {
    primary: {
      main: customColors.mainTextColor,
    },
    background: {
      default: customColors.mainBackgroundColor,
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
        },
      },
    },
  },
});

export default theme;
