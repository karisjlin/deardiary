import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  useDeletePost,
  useEditPost,
  useToggleFavourite,
  useToggleLike,
  useUserTabPosts,
  userPostsKey,
} from "../hooks/postQueries";
import { useUserProfile } from "../hooks/userQueries";

type Tab = "posts" | "likes" | "favourites";

const TABS: { key: Tab; label: string }[] = [
  { key: "posts",      label: "Posts"      },
  { key: "likes",      label: "Likes"      },
  { key: "favourites", label: "Favourites" },
];

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const [tab, setTab] = useState<Tab>("posts");

  const isOwn = me?.username === username;
  const qKey = userPostsKey(username, tab);

  const { data: profile, isError: notFound, isLoading: profileLoading } = useUserProfile(username);
  const { data: posts = [] } = useUserTabPosts(username, tab);
  const toggleLike = useToggleLike(qKey);
  const toggleFavourite = useToggleFavourite(qKey);
  const editPost = useEditPost(qKey);
  const deletePost = useDeletePost(qKey);

  const emptyMessages: Record<Tab, string> = {
    posts:      `${username} hasn't posted anything yet.`,
    likes:      `${username} hasn't liked any posts yet.`,
    favourites: `${username} hasn't favourited any posts yet.`,
  };

  if (profileLoading) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;
  }

  if (notFound) {
    return <Typography color="text.secondary">User not found.</Typography>;
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 4, alignItems: "start" }}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>@{username}</Typography>
        {profile && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Joined {new Date(profile.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
          </Typography>
        )}
        <Stack spacing={1}>
          {TABS.map((t) => (
            <Typography
              key={t.key}
              variant="body1"
              onClick={() => setTab(t.key)}
              sx={{
                cursor: "pointer",
                fontWeight: tab === t.key ? 700 : 400,
                textDecoration: tab === t.key ? "underline" : "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {t.label}
            </Typography>
          ))}
        </Stack>
        {isOwn && <Chip label="Your profile" size="small" sx={{ mt: 3 }} />}
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>{TABS.find((t) => t.key === tab)!.label}</Typography>
        {posts.length === 0 ? (
          <Typography color="text.secondary">{emptyMessages[tab]}</Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(id) => toggleLike.mutate(id)}
                onFavourite={(id) => toggleFavourite.mutate(id)}
                onEdit={isOwn && tab === "posts"
                  ? (id, title, body, communities) => editPost.mutate({ postId: id, title, body, communities })
                  : undefined}
                onDelete={isOwn && tab === "posts"
                  ? (id) => deletePost.mutate(id)
                  : undefined}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
