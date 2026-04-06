import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useUpdateBio } from "../hooks/userQueries";

export const AccountPage = () => {
  const { user, updateBio } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [bio, setBio] = useState(user?.bio ?? "");
  const [bioSuccess, setBioSuccess] = useState(false);
  const updateBioMutation = useUpdateBio(user?.username);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSuccess(false);
    setPasswordError(null);
    setPasswordLoading(true);
    try {
      await api.patch("/users/me/password", { newPassword });
      setPasswordSuccess(true);
      setNewPassword("");
    } catch {
      setPasswordError("Failed to update password. Password must be at least 6 characters.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBioSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBioSuccess(false);
    await updateBioMutation.mutateAsync(bio);
    updateBio(bio);
    setBioSuccess(true);
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

      <Typography variant="h6" sx={{ mb: 2 }}>Bio</Typography>
      <Box component="form" onSubmit={handleBioSubmit} sx={{ mb: 4 }}>
        <Stack spacing={2}>
          {bioSuccess && <Alert severity="success">Bio updated.</Alert>}
          {updateBioMutation.isError && <Alert severity="error">Failed to update bio.</Alert>}
          <TextField
            multiline
            minRows={3}
            value={bio}
            onChange={(e) => { setBio(e.target.value); setBioSuccess(false); }}
            placeholder="Tell people a little about yourself…"
            slotProps={{ htmlInput: { maxLength: 300 } }}
            helperText={`${bio.length}/300`}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={updateBioMutation.isPending}
            sx={{ alignSelf: "flex-start" }}
          >
            Save bio
          </Button>
        </Stack>
      </Box>

      <Typography
        variant="body1"
        onClick={() => setShowPasswordForm((v) => !v)}
        sx={{ textDecoration: "underline", cursor: "pointer", display: "inline-block", mb: 2 }}
      >
        Reset password
      </Typography>

      {showPasswordForm && (
        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {passwordSuccess && <Alert severity="success">Password updated successfully.</Alert>}
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              slotProps={{ htmlInput: { minLength: 6 } }}
            />
            <Button type="submit" variant="contained" disabled={passwordLoading}>
              Update password
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
