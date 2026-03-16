import { Box, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

type Tab = "posts" | "likes" | "favourites";

const TABS: { key: Tab; label: string; endpoint: string }[] = [
  { key: "posts",      label: "Posts",      endpoint: "posts"      },
  { key: "likes",      label: "Likes",      endpoint: "liked"      },
  { key: "favourites", label: "Favourites", endpoint: "favourited" },
];

interface ProfileUser {
  id: number;
  username: string;
  created_at: string;
}

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [notFound, setNotFound] = useState(false);

  const isOwn = me?.username === username;

  useEffect(() => {
    api.get<ProfileUser>(`/users/u/${username}`)
      .then(({ data }) => setProfile(data))
      .catch(() => setNotFound(true));
  }, [username]);

  const activeEndpoint = TABS.find((t) => t.key === tab)!.endpoint;

  const reload = async (endpoint: string) => {
    const { data } = await api.get<Post[]>(`/users/u/${username}/${endpoint}`);
    setPosts(data);
  };

  useEffect(() => {
    if (!profile) return;
    void reload(activeEndpoint);
  }, [tab, profile, username]);

  const likePost = async (postId: number) => {
    await api.post(`/posts/${postId}/like`);
    await reload(activeEndpoint);
  };

  const favouritePost = async (postId: number) => {
    await api.post(`/posts/${postId}/favourite`);
    await reload(activeEndpoint);
  };

  const editPost = async (postId: number, title: string, body: string, communities: string[]) => {
    await api.patch(`/posts/${postId}`, { title, body, communities });
    await reload(activeEndpoint);
  };

  const deletePost = async (postId: number) => {
    await api.delete(`/posts/${postId}`);
    await reload(activeEndpoint);
  };

  const emptyMessages: Record<Tab, string> = {
    posts:      `${username} hasn't posted anything yet.`,
    likes:      `${username} hasn't liked any posts yet.`,
    favourites: `${username} hasn't favourited any posts yet.`,
  };

  if (notFound) {
    return <Typography color="text.secondary">User not found.</Typography>;
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 4, alignItems: "start" }}>
      {/* Left: profile info */}
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
        {isOwn && (
          <Chip label="Your profile" size="small" sx={{ mt: 3 }} />
        )}
      </Box>

      {/* Right: posts */}
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
                onLike={likePost}
                onFavourite={favouritePost}
                onEdit={isOwn && tab === "posts" ? editPost : undefined}
                onDelete={isOwn && tab === "posts" ? deletePost : undefined}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
