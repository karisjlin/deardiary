import { Alert, Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

type Sort = "recent" | "top";

export const CommunityPage = () => {
  const { user } = useAuth();
  const { name } = useParams<{ name: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<Sort>("recent");
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (currentSort: Sort) => {
    try {
      const { data } = await api.get<Post[]>(`/communities/${name}/posts?sort=${currentSort}`);
      setPosts(data);
    } catch {
      setError("Unable to load community posts.");
    }
  };

  useEffect(() => {
    void loadPosts(sort);
  }, [name, sort]);

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">d/{name}</Typography>
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_e, val) => { if (val) setSort(val as Sort); }}
          size="small"
        >
          <ToggleButton value="recent">Recent</ToggleButton>
          <ToggleButton value="top">Top</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack spacing={2}>
        {posts.length === 0 && !error ? (
          <Typography color="text.secondary">No posts in this community yet.</Typography>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={likePost}
              onFavourite={favouritePost}
              onEdit={post.author_id === user?.id ? editPost : undefined}
              onDelete={post.author_id === user?.id ? deletePost : undefined}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};
