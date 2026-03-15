import { Alert, Box, Dialog, DialogContent, DialogTitle, Fab, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [sort, setSort] = useState<"recent" | "top">("recent");

  const loadPosts = async (currentSort: "recent" | "top") => {
    try {
      const { data } = await api.get<Post[]>(`/posts?sort=${currentSort}`);
      setPosts(data);
    } catch {
      setError("Unable to load posts.");
    }
  };

  useEffect(() => {
    void loadPosts(sort);
  }, [sort]);

  const createPost = async (payload: {
    title: string;
    body: string;
    communities: string[];
  }) => {
    await api.post("/posts", payload);
    setComposerOpen(false);
    await loadPosts(sort);
  };

  const likePost = async (postId: number) => {
    await api.post(`/posts/${postId}/like`);
    await loadPosts(sort);
  };

  const favouritePost = async (postId: number) => {
    await api.post(`/posts/${postId}/favourite`);
    await loadPosts(sort);
  };

  const editPost = async (postId: number, title: string, body: string, communities: string[]) => {
    await api.patch(`/posts/${postId}`, { title, body, communities });
    await loadPosts(sort);
  };

  const deletePost = async (postId: number) => {
    await api.delete(`/posts/${postId}`);
    await loadPosts(sort);
  };

  return (
    <Box>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={3} alignItems="baseline">
            <Typography variant="h4">Posts</Typography>
            <Typography
              component={Link}
              to="/app/communities"
              variant="h4"
              sx={{ textDecoration: "none", color: "inherit", "&:hover": { opacity: 0.7 } }}
            >
              Communities
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={(_e, val) => { if (val) setSort(val as "recent" | "top"); }}
            size="small"
          >
            <ToggleButton value="recent">Latest</ToggleButton>
            <ToggleButton value="top">Top</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={likePost}
            onFavourite={favouritePost}
            onEdit={post.author_id === user?.id ? editPost : undefined}
            onDelete={post.author_id === user?.id ? deletePost : undefined}
          />
        ))}
      </Stack>

      <Fab
        onClick={() => setComposerOpen(true)}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" }
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={composerOpen} onClose={() => setComposerOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Create a post
          <IconButton onClick={() => setComposerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PostComposer onSubmit={createPost} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
