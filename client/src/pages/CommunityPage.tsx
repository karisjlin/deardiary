import { Alert, Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  communityPostsKey,
  useCommunityPosts,
  useDeletePost,
  useEditPost,
  useToggleFavourite,
  useToggleLike,
} from "../hooks/postQueries";

type Sort = "recent" | "top";

export const CommunityPage = () => {
  const { user } = useAuth();
  const { name } = useParams<{ name: string }>();
  const [sort, setSort] = useState<Sort>("recent");

  const qKey = communityPostsKey(name, sort);
  const { data: posts = [], error } = useCommunityPosts(name, sort);
  const toggleLike = useToggleLike(qKey);
  const toggleFavourite = useToggleFavourite(qKey);
  const editPost = useEditPost(qKey);
  const deletePost = useDeletePost(qKey);

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
      {error ? <Alert severity="error">Unable to load community posts.</Alert> : null}
      <Stack spacing={2}>
        {posts.length === 0 && !error ? (
          <Typography color="text.secondary">No posts in this community yet.</Typography>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </Stack>
    </Box>
  );
};
