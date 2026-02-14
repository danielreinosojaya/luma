"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const lumaTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FAF8F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C2623",
      secondary: "#A89887",
    },
    primary: {
      main: "#C4956F",
      dark: "#8B7765",
    },
    secondary: {
      main: "#8B7765",
    },
    divider: "#E8DDD4",
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: "'Inter', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      color: "#8B7765",
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      color: "#8B7765",
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      color: "#8B7765",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#2C2623",
          "& fieldset": {
            borderColor: "#E8DDD4",
          },
          "&:hover fieldset": {
            borderColor: "#C4956F",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#C4956F",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#A89887",
          "&.Mui-focused": {
            color: "#C4956F",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#A89887",
          "&.Mui-selected": {
            color: "#C4956F",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#E8DDD4",
          "&.Mui-checked": {
            color: "#C4956F",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FAF8F6",
          borderRadius: "0",
        },
      },
    },
  },
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lumaTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
