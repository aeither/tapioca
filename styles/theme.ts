import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: "12px" } },
    },
  },
});
