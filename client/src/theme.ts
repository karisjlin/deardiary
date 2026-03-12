import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#01411C"
    },
    secondary: {
      main: "#1c2a38"
    },
    background: {
      default: "#f5f1ea",
      paper: "#fffaf4"
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h3: {
      fontWeight: 700
    },
    h4: {
      fontWeight: 700
    }
  }
});
