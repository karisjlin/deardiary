import { Alert, Box, Dialog, DialogContent, DialogTitle, Fab, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import type { Post } from "../types";

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const loadPosts = async () => {
    try {
      const { data } = await api.get<Post[]>("/posts");
      setPosts(data);
    } catch {
      setError("Unable to load posts.");
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const createPost = async (payload: {
    title: string;
    body: string;
    communities: string[];
  }) => {
    await api.post("/posts", payload);
    setComposerOpen(false);
    await loadPosts();
  };

  const likePost = async (postId: number) => {
    await api.post(`/posts/${postId}/like`);
    await loadPosts();
  };

  const favouritePost = async (postId: number) => {
    await api.post(`/posts/${postId}/favourite`);
    await loadPosts();
  };

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h4">Latest posts</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={likePost}
            onFavourite={favouritePost}
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
