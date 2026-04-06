import { Router } from "express";
import { changeBio, changePassword, getCurrentUser, getMyFavouredPosts, getMyLikedPosts, getMyPosts, getUserFavouredPosts, getUserLikedPosts, getUserPosts, getUserProfile } from "../controllers/userController.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, asyncHandler(getCurrentUser));
userRoutes.patch("/me/password", requireAuth, asyncHandler(changePassword));
userRoutes.patch("/me/bio", requireAuth, asyncHandler(changeBio));
userRoutes.get("/me/posts", requireAuth, asyncHandler(getMyPosts));
userRoutes.get("/me/liked", requireAuth, asyncHandler(getMyLikedPosts));
userRoutes.get("/me/favourited", requireAuth, asyncHandler(getMyFavouredPosts));

// Public profile routes — must come after /me routes
userRoutes.get("/u/:username", asyncHandler(getUserProfile));
userRoutes.get("/u/:username/posts", optionalAuth, asyncHandler(getUserPosts));
userRoutes.get("/u/:username/liked", optionalAuth, asyncHandler(getUserLikedPosts));
userRoutes.get("/u/:username/favourited", optionalAuth, asyncHandler(getUserFavouredPosts));
