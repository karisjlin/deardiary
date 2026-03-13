import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export const AccountPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Box sx={{ maxWidth: 480 }}>
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
  );
};
