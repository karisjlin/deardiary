import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export const AccountPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.get<Post[]>("/users/me/posts").then(({ data }) => setPosts(data)).catch(() => {});
  }, []);

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
    const { data } = await api.get<Post[]>("/users/me/posts");
    setPosts(data);
  };

  const favouritePost = async (postId: number) => {
    await api.post(`/posts/${postId}/favourite`);
    const { data } = await api.get<Post[]>("/users/me/posts");
    setPosts(data);
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
        {showForm && (
          <Box component="form" onSubmit={handleSubmit}>
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

      {/* Middle: posts */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Posts</Typography>
        {posts.length === 0 ? (
          <Typography color="text.secondary">You haven't posted anything yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={likePost} onFavourite={favouritePost} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
