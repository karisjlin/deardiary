import { Alert, Button, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const AuthForm = ({
  title = "Build your front page",
  subtitle = "Share posts, like threads, and save favourites with a custom React + Express stack.",
  onSuccess
}: {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        await signUp(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      onSuccess?.();
    } catch {
      setError("Authentication failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="auth-card" elevation={0}>
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
      <Tabs value={mode} onChange={(_event, value) => setMode(value)} sx={{ mb: 2 }}>
        <Tab label="Sign up" value="signup" />
        <Tab label="Sign in" value="signin" />
      </Tabs>
      <Stack component="form" spacing={2} onSubmit={submit}>
        {mode === "signup" ? (
          <TextField
            label="Username"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            required
            slotProps={{ htmlInput: { minLength: 3, maxLength: 40 } }}
          />
        ) : null}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required
          slotProps={{ htmlInput: { minLength: 6 } }}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </Stack>
    </Paper>
  );
};
