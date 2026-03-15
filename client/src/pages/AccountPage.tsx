import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

type Tab = "posts" | "likes" | "favourites";

const TABS: { key: Tab; label: string; endpoint: string }[] = [
  { key: "posts",      label: "Posts",      endpoint: "/users/me/posts"     },
  { key: "likes",      label: "Likes",      endpoint: "/users/me/liked"     },
  { key: "favourites", label: "Favourites", endpoint: "/users/me/favourited" },
];

export const AccountPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);

  const activeTab = TABS.find((t) => t.key === tab)!;

  const reload = async () => {
    const { data } = await api.get<Post[]>(activeTab.endpoint);
    setPosts(data);
  };

  useEffect(() => { void reload(); }, [tab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);
    try {
      await api.patch("/users/me/password", { newPassword });
      setSuccess(true);
      setNewPassword("");
    } catch {
      setError("Failed to update password. Password must be at least 6 characters.");
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: number) => {
    await api.post(`/posts/${postId}/like`);
    await reload();
  };

  const favouritePost = async (postId: number) => {
    await api.post(`/posts/${postId}/favourite`);
    await reload();
  };

  const editPost = async (postId: number, title: string, body: string, communities: string[]) => {
    await api.patch(`/posts/${postId}`, { title, body, communities });
    await reload();
  };

  const deletePost = async (postId: number) => {
    await api.delete(`/posts/${postId}`);
    await reload();
  };

  const emptyMessages: Record<Tab, string> = {
    posts:      "You haven't posted anything yet.",
    likes:      "You haven't liked any posts yet.",
    favourites: "You haven't favourited any posts yet.",
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "280px 1fr" }, gap: 4, alignItems: "start" }}>
      {/* Left: account info */}
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Account</Typography>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary">Username</Typography>
          <Typography>@{user?.username}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Email</Typography>
          <Typography>{user?.email}</Typography>
        </Stack>

        <Typography
          variant="body1"
          onClick={() => setShowForm((v) => !v)}
          sx={{ textDecoration: "underline", cursor: "pointer", display: "inline-block", mb: 2 }}
        >
          Reset password
        </Typography>

        {/* Tab links */}
        <Stack spacing={1} sx={{ mt: 3 }}>
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

        {showForm && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
              {success && <Alert severity="success">Password updated successfully.</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                inputProps={{ minLength: 6 }}
              />
              <Button type="submit" variant="contained" disabled={loading}>
                Update password
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Right: post list for active tab */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>{activeTab.label}</Typography>
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
                onEdit={tab === "posts" ? editPost : undefined}
                onDelete={tab === "posts" ? deletePost : undefined}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
