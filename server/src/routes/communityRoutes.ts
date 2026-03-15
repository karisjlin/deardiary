import { Router } from "express";
import { getCommunities, getCommunityPosts } from "../controllers/communityController.js";
import { optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const communityRoutes = Router();

communityRoutes.get("/", asyncHandler(getCommunities));
communityRoutes.get("/:name/posts", optionalAuth, asyncHandler(getCommunityPosts));
