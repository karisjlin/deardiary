import { Button, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";

export const PostComposer = ({
  onSubmit
}: {
  onSubmit: (payload: { title: string; body: string; communities: string[] }) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    title: "",
    body: "",
    communities: "general"
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const communities = form.communities
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    await onSubmit({ title: form.title, body: form.body, communities });
    setForm({ title: "", body: "", communities: "general" });
  };

  return (
    <Paper className="composer" elevation={0}>
      <Stack component="form" spacing={2} onSubmit={submit}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
          slotProps={{ htmlInput: { minLength: 4, maxLength: 160 } }}
        />
        <TextField
          label="Communities"
          value={form.communities}
          helperText="Separate multiple communities with commas"
          onChange={(event) => setForm((current) => ({ ...current, communities: event.target.value.toLowerCase() }))}
          required
        />
        <TextField
          label="Body"
          value={form.body}
          onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
          multiline
          minRows={4}
          required
          helperText="Minimum 10 characters"
          slotProps={{ htmlInput: { minLength: 10, maxLength: 4000 } }}
        />
        <Button type="submit" variant="contained">
          Publish
        </Button>
      </Stack>
    </Paper>
  );
};
