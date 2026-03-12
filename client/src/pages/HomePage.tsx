import { Alert, Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import type { Post } from "../types";

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    community: string;
  }) => {
    await api.post("/posts", payload);
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
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(280px, 360px) 1fr"
        }
      }}
    >
      <Box>
        <PostComposer onSubmit={createPost} />
      </Box>
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
      </Box>
    </Box>
  );
};
