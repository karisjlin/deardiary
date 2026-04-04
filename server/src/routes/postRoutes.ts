import { Router } from "express";
import {
  addPost,
  editPost,
  favouritePost,
  getPostById,
  getPosts,
  likePost,
  removePost,
  searchPosts
} from "../controllers/postController.js";
import { addComment, getComments, removeComment } from "../controllers/commentController.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postRoutes = Router();

postRoutes.get("/", optionalAuth, asyncHandler(getPosts));
postRoutes.get("/search", optionalAuth, asyncHandler(searchPosts));
postRoutes.get("/:postId", optionalAuth, asyncHandler(getPostById));
postRoutes.post("/", requireAuth, asyncHandler(addPost));
postRoutes.patch("/:postId", requireAuth, asyncHandler(editPost));
postRoutes.delete("/:postId", requireAuth, asyncHandler(removePost));
postRoutes.post("/:postId/like", requireAuth, asyncHandler(likePost));
postRoutes.post("/:postId/favourite", requireAuth, asyncHandler(favouritePost));

postRoutes.get("/:postId/comments", asyncHandler(getComments));
postRoutes.post("/:postId/comments", requireAuth, asyncHandler(addComment));
postRoutes.delete("/:postId/comments/:commentId", requireAuth, asyncHandler(removeComment));
