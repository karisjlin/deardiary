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
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useComments, useCreateComment, useDeleteComment } from "../hooks/commentQueries";

export const CommentSection = ({ postId }: { postId: number }) => {
  const { user, token } = useAuth();
  const [body, setBody] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: comments = [], error } = useComments(postId);
  const createComment = useCreateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!body.trim()) return;
    await createComment.mutateAsync(body.trim());
    setBody("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createComment.mutate(body.trim());
      setBody("");
      inputRef.current?.focus();
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
              onKeyDown={handleKeyDown}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />
            <Tooltip title="Post comment">
              <span>
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={createComment.isPending || !body.trim()}
                >
                  <SendRounded />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>Unable to load comments.</Alert>}
      {createComment.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to post comment.</Alert>}
      {deleteComment.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to delete comment.</Alert>}

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
                      year: "numeric", month: "short", day: "numeric"
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
                    onClick={() => deleteComment.mutate(comment.id)}
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
        {comments.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary">
            No comments yet. {token ? "Be the first!" : "Sign in to comment."}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
