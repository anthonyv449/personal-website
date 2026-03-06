import { createTheme } from "@mui/material/styles";

const darkColors = {
  mainTextColor: "#c8c8c6",
  mainBackgroundColor: "#111210",
  grayColor: "#222222",
  secondGray: "#2a2a2a",
  primary: "#81d3ef",
  hoverText: "#eeeeee",
  hoverBackground: "#191919",
  secondaryText: "#9a9a98",
  cardBackground: "#111210",
};

const lightColors = {
  mainTextColor: "#1c1c1a",
  mainBackgroundColor: "#f4f4f2",
  grayColor: "#e4e4e2",
  secondGray: "#d4d4d2",
  primary: "#0888b0",
  hoverText: "#0a0a08",
  hoverBackground: "#ebebea",
  secondaryText: "#6a6a68",
  cardBackground: "#ffffff",
};

export function createAppTheme(mode = "dark") {
  const c = mode === "dark" ? darkColors : lightColors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: c.mainTextColor,
      },
      background: {
        default: c.mainBackgroundColor,
        paper: c.cardBackground,
      },
      greys: {
        default: c.grayColor,
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: {
        color: c.mainTextColor,
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: 1.15,
      },
      h2: {
        color: c.mainTextColor,
        fontSize: "2rem",
        fontWeight: 600,
      },
      h3: {
        color: c.mainTextColor,
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      h4: {
        color: c.mainTextColor,
      },
      h5: {
        color: c.mainTextColor,
      },
      h6: {
        color: c.mainTextColor,
        fontWeight: 600,
      },
      body1: {
        color: c.mainTextColor,
      },
      body2: {
        color: c.secondaryText,
        fontSize: "0.875rem",
      },
      caption: {
        color: c.secondaryText,
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            "&.header": {
              fontWeight: 600,
              fontSize: "1rem",
            },
            "&.paragraph": {
              fontWeight: 400,
              fontSize: "0.9rem",
              color: c.secondaryText,
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: c.mainTextColor,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
            border: `1px solid ${c.secondGray}`,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15)`,
            backgroundColor: c.cardBackground,
            "&:hover": {
              boxShadow: `0 0 0 1px ${c.primary}33, 0 4px 20px rgba(0, 0, 0, 0.2)`,
              transform: "translateY(-2px)",
              zIndex: 1,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: c.mainTextColor,
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
            color: c.mainTextColor,
            background: c.mainBackgroundColor,
            "&:hover": {
              color: c.hoverText,
              background: c.hoverBackground,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: c.mainTextColor,
            "&:hover": {
              color: c.hoverText,
              background: c.hoverBackground,
            },
          },
        },
      },
    },
  });
}

export default createAppTheme("dark");
