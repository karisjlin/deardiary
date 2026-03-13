import LogoutRounded from "@mui/icons-material/LogoutRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Layout = () => {
  const { user, signOut } = useAuth();

  return (
    <Box className="shell">
      <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
        <Toolbar className="topbar__inner">
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            className="brand-link"
          >
            DearDiary
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="body2"
              component={RouterLink}
              to="/app/account"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              @{user?.username}
            </Typography>
            <Button
              color="secondary"
              variant="outlined"
              startIcon={<LogoutRounded />}
              onClick={signOut}
            >
              Sign out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
