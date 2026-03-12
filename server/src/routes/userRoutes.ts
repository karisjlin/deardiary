import { Router } from "express";
import { getCurrentUser, getUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.get("/", asyncHandler(getUsers));
userRoutes.get("/me", requireAuth, asyncHandler(getCurrentUser));
