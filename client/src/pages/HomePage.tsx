import { Alert, Box, Dialog, DialogContent, DialogTitle, Fab, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { useAuth } from "../context/AuthContext";
import {
  postListKey,
  useCreatePost,
  useDeletePost,
  useEditPost,
  usePosts,
  useToggleFavourite,
  useToggleLike,
} from "../hooks/postQueries";

export const HomePage = () => {
  const { user } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);
  const [sort, setSort] = useState<"recent" | "top">("recent");

  const qKey = postListKey(sort);
  const { data: posts = [], error } = usePosts(sort);
  const createPost = useCreatePost(sort);
  const toggleLike = useToggleLike(qKey);
  const toggleFavourite = useToggleFavourite(qKey);
  const editPost = useEditPost(qKey);
  const deletePost = useDeletePost(qKey);

  const handleCreate = async (payload: { title: string; body: string; communities: string[] }) => {
    await createPost.mutateAsync(payload);
    setComposerOpen(false);
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
        {error ? <Alert severity="error">Unable to load posts.</Alert> : null}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={(id) => toggleLike.mutate(id)}
            onFavourite={(id) => toggleFavourite.mutate(id)}
            onEdit={post.author_id === user?.id
              ? (id, title, body, communities) => editPost.mutate({ postId: id, title, body, communities })
              : undefined}
            onDelete={post.author_id === user?.id
              ? (id) => deletePost.mutate(id)
              : undefined}
          />
        ))}
      </Stack>

      <Fab
        onClick={() => setComposerOpen(true)}
        sx={{ position: "fixed", bottom: 32, right: 32, bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
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
          <PostComposer onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
