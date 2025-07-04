import { createTheme } from "@mui/material/styles";

const customColors = {
  mainTextColor: "#b4b4b4",
  mainBackgroundColor: "#111210",
  grayColor: "#222222",
  secondGray: "#2a2a2a",
  primary: "#81d3ef",
  hoverText: "#eeeeee",
  hoverBackground: "#191919",
};

const theme = createTheme({
  palette: {
    primary: {
      main: customColors.mainTextColor,
    },
    background: {
      default: customColors.mainBackgroundColor,
    },
    greys: {
      default: customColors.grayColor,
    },
  },
  typography: {
    h4: {
      color: customColors.mainTextColor,
    },
    h5: {
      color: customColors.mainTextColor,
    },
    body1: {
      color: customColors.mainTextColor,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
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
    MuiListItem: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          width: "15rem",
          height: "12rem",
          border: `1px solid ${customColors.secondGray}`,
          boxShadow: `0.125rem 0.125rem 0.0625rem 0.0625rem ${customColors.grayColor}, 0.125rem 0.1875rem 0.0625rem 0.0625rem ${customColors.secondGray}, 0.5625rem 0.875rem 1.125rem rgba(0, 0, 0, 0.062)`,
          transform: "translateY(-0.625rem)",
          "&:hover": {
            transform: " rotate(-0.5deg) translateY(-1rem)",
            boxShadow: `0.125rem 0.125rem 0.3125rem 0.125rem ${customColors.grayColor}, 0.125rem 0.1875rem 0.3125rem 0.125rem ${customColors.secondGray}, 0.5625rem 0.875rem 1.125rem rgba(0, 0, 0, 0.062)`,
            zIndex: 1,
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
    MuiButton: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
          background: customColors.mainBackgroundColor,
          "&:hover": {
            color: customColors.hoverText,
            background: customColors.hoverBackground,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: customColors.mainTextColor,
          "&:hover": {
            color: customColors.hoverText,
            background: customColors.hoverBackground,
          },
        },
      },
    },
  },
});

export default theme;
