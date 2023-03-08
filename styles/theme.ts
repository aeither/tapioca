import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: "12px" } },
    },
  },
});
