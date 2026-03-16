import LogoutRounded from "@mui/icons-material/LogoutRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import { AppBar, Button, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, token, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
                onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                sx={{ cursor: "pointer", color: "inherit", "&:hover": { opacity: 0.8 } }}
              >
                @{user.username}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                disableAutoFocusItem
                sx={{ pointerEvents: "none" }}
                PaperProps={{
                  onMouseLeave: () => setAnchorEl(null),
                  sx: { pointerEvents: "auto" },
                }}
              >
                <MenuItem
                  component={RouterLink}
                  to="/app/account"
                  onClick={() => setAnchorEl(null)}
                >
                  Account
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to={`/app/u/${user.username}`}
                  onClick={() => setAnchorEl(null)}
                >
                  Profile
                </MenuItem>
              </Menu>
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
