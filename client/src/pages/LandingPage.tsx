import LoginRounded from "@mui/icons-material/LoginRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { AuthForm } from "../components/AuthForm";
import type { Post } from "../types";

export const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await api.get<Post[]>("/posts");
        setPosts([...data].sort((a, b) => b.likes_count - a.likes_count).slice(0, 5));
      } catch {
        setError("Unable to load recent posts.");
      }
    };

    void loadPosts();
  }, []);

  const handleSuccess = () => {
    setOpen(false);
    navigate("/app");
  };

  return (
    <Box className="landing-shell">
      <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
        <Toolbar className="topbar__inner">
          <Typography variant="h6" className="brand-link">
            DearDiary
          </Typography>
          <Button
            color="primary"
            variant="text"
            startIcon={<LoginRounded />}
            onClick={() => setOpen(true)}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="hero-card">
          <Stack spacing={3} sx={{ maxWidth: 720 }}>
            <Typography variant="overline" className="hero-kicker">
              Personal stories, organized
            </Typography>
            <Typography variant="h2" className="hero-title">
              Welcome to DearDiary
            </Typography>
            <Typography variant="h6" color="text.secondary" className="hero-copy">
              Capture thoughts, publish entries, and revisit the moments that matter in a calmer social space.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                startIcon={<MenuBookRounded />}
                onClick={() => setOpen(true)}
              >
                Start writing
              </Button>
            </Stack>
            <Divider flexItem />
            <Stack spacing={2}>
              <Typography variant="h5">Most liked posts</Typography>
              {error ? <Alert severity="warning">{error}</Alert> : null}
              {posts.map((post) => (
                <Box key={post.id} className="landing-post">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="h6"
                      component={RouterLink}
                      to={`/posts/${post.id}`}
                      className="landing-post__link"
                    >
                      {post.title}
                    </Typography>
                    <Chip
                      label={`${post.likes_count} ${post.likes_count === 1 ? "like" : "likes"}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    @{post.author_username} in r/{post.community}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AuthForm
            title="Join DearDiary"
            subtitle="Sign in or create an account to start posting entries and building your private front page."
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
