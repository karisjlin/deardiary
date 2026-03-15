import LogoutRounded from "@mui/icons-material/LogoutRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, token, signOut } = useAuth();

  return (
    <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
      <Toolbar className="topbar__inner">
        <Typography
          variant="h6"
          component={RouterLink}
          to={token ? "/app" : "/"}
          className="brand-link"
        >
          DearDiary
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {token && user ? (
            <>
              <Typography
                variant="body2"
                component={RouterLink}
                to="/app/account"
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                @{user.username}
              </Typography>
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<LogoutRounded />}
                onClick={signOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/" color="primary" startIcon={<LoginRounded />}>
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
