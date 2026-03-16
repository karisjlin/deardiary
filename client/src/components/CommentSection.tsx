import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Comment } from "../types";

export const CommentSection = ({ postId }: { postId: number }) => {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadComments = async () => {
    const { data } = await api.get<Comment[]>(`/posts/${postId}/comments`);
    setComments(data);
  };

  useEffect(() => {
    void loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post(`/posts/${postId}/comments`, { body: body.trim() });
      setBody("");
      await loadComments();
      inputRef.current?.focus();
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </Typography>

      {token && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={6}
              size="small"
              placeholder="Write a comment…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
            <Tooltip title="Post comment">
              <span>
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={submitting || !body.trim()}
                >
                  <SendRounded />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        {comments.map((comment) => (
          <Box key={comment.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    component={Link}
                    to={`/app/u/${comment.author_username}`}
                    sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                  >
                    @{comment.author_username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Typography>
              </Stack>
              {user?.id === comment.user_id && (
                <Tooltip title="Delete comment">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(comment.id)}
                    sx={{ ml: 1, color: "text.disabled" }}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No comments yet. {token ? "Be the first!" : "Sign in to comment."}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
