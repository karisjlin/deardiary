import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  useDeletePost,
  useEditPost,
  useSearchPosts,
  useToggleFavourite,
  useToggleLike,
} from "../hooks/postQueries";

export const SearchPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const qKey = ["posts-search", query] as const;
  const { data: posts = [], isLoading, error } = useSearchPosts(query);
  const toggleLike = useToggleLike(qKey);
  const toggleFavourite = useToggleFavourite(qKey);
  const editPost = useEditPost(qKey);
  const deletePost = useDeletePost(qKey);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Search results
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {query ? `"${query}"` : "Enter a search term above"}
      </Typography>

      {isLoading && (
        <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">Search failed. Please try again.</Alert>}

      {!isLoading && !error && query.trim().length > 1 && posts.length === 0 && (
        <Typography color="text.secondary">No posts found for "{query}".</Typography>
      )}

      <Stack spacing={2}>
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
    </Box>
  );
};
