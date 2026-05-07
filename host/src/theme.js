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

/** Landing palette for HumanProof remote (Module Federation). Access via theme.humanProof in sx. */
const humanProof = {
  ink: "#0a0a08",
  paper: "#f4f1eb",
  paper2: "#ede9e0",
  green: "#1a7a4a",
  greenLight: "#d4edd9",
  greenAccent: "#2db866",
  amber: "#c4730a",
  amberLight: "#fdecd0",
  red: "#b02020",
  redLight: "#fde8e8",
  muted: "#6b6758",
  border: "#ccc8bc",
  white: "#fdfcf8",
  certBg: "#111109",
  certInner: "#0a0a08",
  certBorder: "#1e1e18",
  certMuted: "#444440",
  certText: "#666660",
  tagOfficial: "#1a4a8a",
  tagOfficialBg: "#dce8f4",
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
    humanProof,
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
      humanProofBody: {
        fontFamily: '"DM Mono", "Consolas", "Courier New", monospace',
        fontSize: 15,
        lineHeight: 1.6,
        fontWeight: 300,
      },
      humanProofHeading: {
        fontFamily:
          '"Syne", "Helvetica Neue", "Arial Narrow", "Arial", sans-serif',
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
      },
      humanProofSerif: {
        fontFamily: '"Instrument Serif", "Georgia", "Times New Roman", serif',
        fontStyle: "italic",
        fontWeight: 400,
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
