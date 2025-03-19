import { createTheme } from "@mui/material/styles";

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
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
          "&.header": {
            fontWeight: 600,
            fontSize: 18,
          },
          "&.paragraph": {
            fontWeight: 300,
            fontSize: 14,
          },
        },
      },
    },
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
    MuiGrid2: {
      styleOverrides: {
        root: {
          "&.main-container": {
            height: "100%",
            alignItems: "flex-start",
          },
        },
      },
    },
  },
});

export default theme;
