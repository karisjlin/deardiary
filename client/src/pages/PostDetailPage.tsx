import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { Alert, Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { CommentSection } from "../components/CommentSection";
import { Header } from "../components/Header";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  useDetailDeletePost,
  useDetailEditPost,
  useDetailToggleFavourite,
  useDetailToggleLike,
  usePost,
} from "../hooks/postQueries";

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = usePost(postId);
  const toggleLike = useDetailToggleLike(postId);
  const toggleFavourite = useDetailToggleFavourite(postId);
  const editPost = useDetailEditPost(postId);
  const deletePost = useDetailDeletePost(postId);

  const isOwner = user && post && post.author_id === user.id;

  const handleDelete = () => {
    deletePost.mutate();
    navigate(token ? "/app" : "/");
  };

  return (
    <Box className={token ? undefined : "landing-shell"}>
      {!token && <Header />}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Button
            component={RouterLink}
            to={token ? "/app" : "/"}
            startIcon={<ArrowBackRounded />}
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button>

          {isLoading && (
            <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
          {error && <Alert severity="error">Unable to load this post.</Alert>}

          {post && (
            <PostCard
              post={post}
              detail
              onLike={() => toggleLike.mutate()}
              onFavourite={() => toggleFavourite.mutate()}
              onEdit={isOwner
                ? (id, title, body, communities) => editPost.mutate({ title, body, communities })
                : undefined}
              onDelete={isOwner ? () => handleDelete() : undefined}
            />
          )}

          {post && <CommentSection postId={post.id} />}
        </Stack>
      </Container>
    </Box>
  );
};
