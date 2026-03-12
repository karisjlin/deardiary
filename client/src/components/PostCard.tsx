import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import ThumbUpOffAltRounded from "@mui/icons-material/ThumbUpOffAltRounded";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Post } from "../types";

export const PostCard = ({
  post,
  onLike,
  onFavourite
}: {
  post: Post;
  onLike: (postId: number) => Promise<void>;
  onFavourite: (postId: number) => Promise<void>;
}) => {
  return (
    <Paper className="post-card" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Chip label={`r/${post.community}`} color="primary" variant="outlined" />
        <Typography variant="body2" color="text.secondary">
          @{post.author_username}
        </Typography>
      </Stack>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {post.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {post.body}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant={post.liked_by_me ? "contained" : "outlined"}
          startIcon={<ThumbUpOffAltRounded />}
          onClick={() => onLike(post.id)}
        >
          {post.likes_count} Likes
        </Button>
        <Button
          variant={post.favourited_by_me ? "contained" : "outlined"}
          color="secondary"
          startIcon={<FavoriteBorderRounded />}
          onClick={() => onFavourite(post.id)}
        >
          {post.favourites_count} Favourites
        </Button>
      </Stack>
    </Paper>
  );
};
