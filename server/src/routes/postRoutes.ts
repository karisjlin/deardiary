import { Router } from "express";
import {
  addPost,
  favouritePost,
  getPostById,
  getPosts,
  likePost
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postRoutes = Router();

postRoutes.get("/", asyncHandler(getPosts));
postRoutes.get("/:postId", asyncHandler(getPostById));
postRoutes.post("/", requireAuth, asyncHandler(addPost));
postRoutes.post("/:postId/like", requireAuth, asyncHandler(likePost));
postRoutes.post("/:postId/favourite", requireAuth, asyncHandler(favouritePost));
