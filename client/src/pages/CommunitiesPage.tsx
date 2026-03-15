import { Alert, Box, Chip, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

interface Community {
  id: number;
  name: string;
  created_at: string;
  post_count: number;
}

type Sort = "alpha" | "popular";

export const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [sort, setSort] = useState<Sort>("alpha");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Community[]>("/communities")
      .then(({ data }) => setCommunities(data))
      .catch(() => setError("Unable to load communities."));
  }, []);

  const sorted = [...communities].sort((a, b) =>
    sort === "alpha" ? a.name.localeCompare(b.name) : b.post_count - a.post_count
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Communities</Typography>
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_e, val) => { if (val) setSort(val as Sort); }}
          size="small"
        >
          <ToggleButton value="alpha">A–Z</ToggleButton>
          <ToggleButton value="popular">Popular</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={2}>
        {sorted.map((c) => (
          <Paper
            key={c.id}
            elevation={0}
            component={Link}
            to={`/app/d/${c.name}`}
            sx={{ p: 2, textDecoration: "none", display: "block", "&:hover": { opacity: 0.85 } }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Chip label={`d/${c.name}`} color="primary" />
              <Typography variant="body2" color="text.secondary">
                {c.post_count} {c.post_count === 1 ? "post" : "posts"}
              </Typography>
            </Stack>
          </Paper>
        ))}
        {communities.length === 0 && !error && (
          <Typography color="text.secondary">No communities yet.</Typography>
        )}
      </Stack>
    </Box>
  );
};
