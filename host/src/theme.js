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
  humanProof,
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
