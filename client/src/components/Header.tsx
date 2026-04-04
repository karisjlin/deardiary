import LogoutRounded from "@mui/icons-material/LogoutRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { AppBar, Button, InputAdornment, Menu, MenuItem, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQuery(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (!token || query.trim().length < 2) return;
    navigate(`/app/search?q=${encodeURIComponent(query.trim())}`);
  }, [query]);

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

        {(
          <TextField
            size="small"
            placeholder="Search posts…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setInput("");
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: 240 }}
          />
        )}

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
