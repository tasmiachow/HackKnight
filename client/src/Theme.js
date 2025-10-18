// src/theme.js
import { alpha, createTheme } from "@mui/material/styles";

const COLORS = {
  bg: "#011314",        // background start
  bgLight: "#182B29",   // background end
  logo: "#61D47B",      // logo / brand green
  accent: "#B8F966",    // bright accent
  text: "#B9C4C7",      // primary text
  bold: "#B8F966",      // bold/highlight text
  btn: "#BDFF65",       // button color
};

const glass = {
  background: "rgba(1, 19, 20, 0.65)",
  border: `1px solid ${alpha(COLORS.accent, 0.18)}`,
  backdropFilter: "blur(14px) saturate(120%)",
  WebkitBackdropFilter: "blur(14px) saturate(120%)",
  boxShadow: `
    inset 0 0 0 1px rgba(255,255,255,.02),
    0 8px 30px rgba(0,0,0,.45),
    0 0 30px ${alpha(COLORS.accent, 0.25)}
  `,
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: COLORS.bg,
      paper: "rgba(1,19,20,0.65)",
    },
    primary: { main: COLORS.logo },
    secondary: { main: COLORS.accent },
    text: {
      primary: COLORS.text,
      secondary: alpha(COLORS.text, 0.7),
    },
    success: { main: COLORS.btn },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700, color: COLORS.bold },
    h2: { fontWeight: 700, color: COLORS.bold },
    h3: { fontWeight: 700, color: COLORS.bold },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          /* MAIN HORIZONTAL BACKGROUND */
          background: `
            /* Left to right gradient #011314 to #182B29 */
            linear-gradient(90deg, ${COLORS.bg} 0%, ${COLORS.bgLight} 100%)
          `,
          color: COLORS.text,
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        },

        "body::before": {
          content: "none",
        },

        /* Gradient text utility */
        ".text-gradient": {
          background: `linear-gradient(180deg, ${COLORS.bold}, #9fe660)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontWeight: 800,
        },

        /* Pill badge utility */
        ".pill": {
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: 999,
          border: `1px solid ${alpha(COLORS.accent, 0.25)}`,
          background: alpha(COLORS.accent, 0.12),
          color: COLORS.bold,
          fontSize: "0.75rem",
          fontWeight: 700,
        },
      },
    },

    /* Glassmorphism Paper */
    MuiPaper: {
      defaultProps: { elevation: 0, square: false },
      styleOverrides: { root: { ...glass } },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            background: "rgba(1,19,20,0.8)",
            border: `1px solid ${alpha(COLORS.accent, 0.18)}`,
            backdropFilter: "blur(10px) saturate(120%)",
          },
        },
      ],
    },

    /* Buttons */
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 10,
          textTransform: "none",
        },
        containedPrimary: {
          background: `linear-gradient(180deg, ${COLORS.btn}, ${alpha(
            COLORS.btn,
            0.85
          )})`,
          color: "#0a140e",
          border: `1px solid ${alpha("#000", 0.2)}`,
          boxShadow: `0 6px 18px ${alpha(COLORS.btn, 0.18)}`,
          "&:hover": {
            background: `linear-gradient(180deg, ${COLORS.btn}, ${alpha(
              COLORS.btn,
              0.78
            )})`,
            boxShadow: `0 10px 24px ${alpha(COLORS.btn, 0.25)}`,
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: alpha(COLORS.accent, 0.25),
          "&:hover": {
            borderColor: COLORS.accent,
            background: alpha(COLORS.accent, 0.08),
          },
        },
      },
    },

    /* AppBar */
    MuiAppBar: {
      defaultProps: { color: "transparent", position: "sticky" },
      styleOverrides: {
        root: {
          background: "rgba(1,19,20,0.8)",
          backdropFilter: "blur(12px)",
        },
      },
    },

    /* Input Fields */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.02)",
          borderRadius: 10,
          "& fieldset": { borderColor: alpha(COLORS.accent, 0.15) },
          "&:hover fieldset": { borderColor: alpha(COLORS.accent, 0.35) },
          "&.Mui-focused fieldset": {
            borderColor: COLORS.accent,
            boxShadow: `0 0 0 3px ${alpha(COLORS.accent, 0.15)}`,
          },
        },
        input: { color: COLORS.text },
      },
    },

    /* Chip + Divider */
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: alpha(COLORS.accent, 0.25),
          background: alpha(COLORS.accent, 0.12),
          color: COLORS.bold,
          fontWeight: 700,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: alpha(COLORS.accent, 0.12) },
      },
    },
  },
});

/* Custom helper for frosted panels */
theme.custom = {
  glassSx: {
    ...glass,
    borderRadius: 2,
    p: 2,
  },
};

export default theme;
