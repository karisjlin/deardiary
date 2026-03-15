import { Router } from "express";
import { changePassword, getCurrentUser, getMyFavouredPosts, getMyLikedPosts, getMyPosts, getUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.get("/", asyncHandler(getUsers));
userRoutes.get("/me", requireAuth, asyncHandler(getCurrentUser));
userRoutes.patch("/me/password", requireAuth, asyncHandler(changePassword));
userRoutes.get("/me/posts", requireAuth, asyncHandler(getMyPosts));
userRoutes.get("/me/liked", requireAuth, asyncHandler(getMyLikedPosts));
userRoutes.get("/me/favourited", requireAuth, asyncHandler(getMyFavouredPosts));
