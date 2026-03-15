import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => (
  <Box className="shell">
    <Header />
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Outlet />
    </Container>
  </Box>
);
