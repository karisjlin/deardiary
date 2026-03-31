import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import ThumbUpOffAltRounded from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbUpRounded from "@mui/icons-material/ThumbUpRounded";
import {
  Button,
  Chip,
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
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../types";

export const PostCard = ({
  post,
  onLike,
  onFavourite,
  onEdit,
  onDelete
}: {
  post: Post;
  onLike: (postId: number) => Promise<void>;
  onFavourite: (postId: number) => Promise<void>;
  onEdit?: (postId: number, title: string, body: string, communities: string[]) => Promise<void>;
  onDelete?: (postId: number) => Promise<void>;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [communities, setCommunities] = useState(post.community.join(", "));

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = communities.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    await onEdit!(post.id, title, body, parsed);
    setEditOpen(false);
  };

  return (
    <Paper className="post-card" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {post.community.map((c) => (
            <Chip
              key={c}
              label={`d/${c}`}
              color="primary"
              variant="outlined"
              component={Link}
              to={`/app/d/${c}`}
              clickable
            />
          ))}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            component={Link}
            to={`/app/u/${post.author_username}`}
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            @{post.author_username}
          </Typography>
          {onEdit && (
            <IconButton size="small" onClick={() => setEditOpen(true)}>
              <EditRounded fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton size="small" color="error" onClick={() => setDeleteOpen(true)}>
              <DeleteOutlineRounded fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Typography variant="h5" sx={{ mb: 1 }}>
        <Link to={`/posts/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          {post.title}
        </Link>
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {post.body}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant={post.liked_by_me ? "contained" : "outlined"}
          startIcon={post.liked_by_me ? <ThumbUpRounded /> : <ThumbUpOffAltRounded />}
          onClick={() => onLike(post.id)}
        >
          {post.likes_count} Likes
        </Button>
        <Button
          variant={post.favourited_by_me ? "contained" : "outlined"}
          color="secondary"
          startIcon={post.favourited_by_me ? <FavoriteRounded /> : <FavoriteBorderRounded />}
          onClick={() => onFavourite(post.id)}
        >
          {post.favourites_count} Favourites
        </Button>
        <Button
          component={Link}
          to={`/posts/${post.id}`}
          variant="text"
          startIcon={<ChatBubbleOutlineRounded />}
          sx={{ color: "text.secondary" }}
        >
          {post.comments_count} {post.comments_count === 1 ? "Comment" : "Comments"}
        </Button>
      </Stack>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete post?</DialogTitle>
        <DialogContent>
          <Typography>This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => { setDeleteOpen(false); onDelete!(post.id); }}>
            Delete
          </Button>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              slotProps={{ htmlInput: { minLength: 4, maxLength: 160 } }}
            />
            <TextField
              label="Communities"
              value={communities}
              helperText="Separate multiple communities with commas"
              onChange={(e) => setCommunities(e.target.value.toLowerCase())}
              required
            />
            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              multiline
              minRows={4}
              required
              slotProps={{ htmlInput: { minLength: 10, maxLength: 4000 } }}
            />
            <Button type="submit" variant="contained">Save</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};
