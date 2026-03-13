import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { api } from "../api/client";
import { CommentSection } from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export const PostDetailPage = () => {
  const { postId } = useParams();
  const { token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await api.get<Post>(`/posts/${postId}`);
        setPost(data);
      } catch {
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [postId]);

  return (
    <Box className="landing-shell">
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
          {!token ? (
            <Button component={RouterLink} to="/" color="primary" startIcon={<LoginRounded />}>
              Login
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Button
            component={RouterLink}
            to={token ? "/app" : "/"}
            startIcon={<ArrowBackRounded />}
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button>
          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          {post ? (
            <Paper className="post-card" elevation={0}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Chip label={`r/${post.community}`} color="primary" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  @{post.author_username}
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {post.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {post.body}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={`${post.likes_count} ${post.likes_count === 1 ? "Like" : "Likes"}`}
                  color="primary"
                />
                <Chip
                  label={`${post.favourites_count} ${post.favourites_count === 1 ? "Favourite" : "Favourites"}`}
                  color="secondary"
                />
              </Stack>
            </Paper>
          ) : null}
          {post ? <CommentSection postId={post.id} /> : null}
        </Stack>
      </Container>
    </Box>
  );
};
