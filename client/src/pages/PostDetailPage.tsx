import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import ThumbUpOffAltRounded from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbUpRounded from "@mui/icons-material/ThumbUpRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { CommentSection } from "../components/CommentSection";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export const PostDetailPage = () => {
  const { postId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCommunities, setEditCommunities] = useState("");

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

  useEffect(() => { void loadPost(); }, [postId]);

  const openEdit = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditCommunities(post.community.join(", "));
    setEditOpen(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const communities = editCommunities.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    await api.patch(`/posts/${postId}`, { title: editTitle, body: editBody, communities });
    setEditOpen(false);
    await loadPost();
  };

  const handleDelete = async () => {
    await api.delete(`/posts/${postId}`);
    navigate(token ? "/app" : "/");
  };

  const handleLike = async () => {
    await api.post(`/posts/${postId}/like`);
    await loadPost();
  };

  const handleFavourite = async () => {
    await api.post(`/posts/${postId}/favourite`);
    await loadPost();
  };

  const isOwner = user && post && post.author_id === user.id;

  return (
    <Box className="landing-shell">
      <Header />
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

          {loading && (
            <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          {post && (
            <Paper className="post-card" elevation={0}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {post.community.map((c) => (
                    <Chip
                      key={c}
                      label={`d/${c}`}
                      color="primary"
                      variant="outlined"
                      component={RouterLink}
                      to={token ? `/app/d/${c}` : "/"}
                      clickable
                    />
                  ))}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    @{post.author_username}
                  </Typography>
                  {isOwner && (
                    <>
                      <IconButton size="small" onClick={openEdit}>
                        <EditRounded fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteOpen(true)}>
                        <DeleteOutlineRounded fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </Stack>

              <Typography variant="h3" sx={{ mb: 2 }}>
                {post.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {post.body}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant={post.liked_by_me ? "contained" : "outlined"}
                  startIcon={post.liked_by_me ? <ThumbUpRounded /> : <ThumbUpOffAltRounded />}
                  onClick={handleLike}
                  disabled={!token}
                >
                  {post.likes_count} {post.likes_count === 1 ? "Like" : "Likes"}
                </Button>
                <Button
                  variant={post.favourited_by_me ? "contained" : "outlined"}
                  color="secondary"
                  startIcon={post.favourited_by_me ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                  onClick={handleFavourite}
                  disabled={!token}
                >
                  {post.favourites_count} {post.favourites_count === 1 ? "Favourite" : "Favourites"}
                </Button>
              </Stack>
            </Paper>
          )}

          {post && <CommentSection postId={post.id} />}
        </Stack>
      </Container>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete post?</DialogTitle>
        <DialogContent>
          <Typography>This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Edit post
          <IconButton onClick={() => setEditOpen(false)}>✕</IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack component="form" spacing={2} onSubmit={submitEdit} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <TextField
              label="Communities"
              value={editCommunities}
              helperText="Separate multiple communities with commas"
              onChange={(e) => setEditCommunities(e.target.value.toLowerCase())}
              required
            />
            <TextField
              label="Body"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              multiline
              minRows={4}
              required
            />
            <Button type="submit" variant="contained">Save</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
