import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const PostComposer = ({
  onSubmit
}: {
  onSubmit: (payload: { title: string; body: string; community: string }) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    title: "",
    body: "",
    community: "general"
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({
      title: "",
      body: "",
      community: "general"
    });
  };

  return (
    <Paper className="composer" elevation={0}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create a post
      </Typography>
      <Stack component="form" spacing={2} onSubmit={submit}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
        />
        <TextField
          label="Community"
          value={form.community}
          onChange={(event) => setForm((current) => ({ ...current, community: event.target.value }))}
          required
        />
        <TextField
          label="Body"
          value={form.body}
          onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
          multiline
          minRows={4}
          required
        />
        <Button type="submit" variant="contained">
          Publish
        </Button>
      </Stack>
    </Paper>
  );
};
