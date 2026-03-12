import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/signup", asyncHandler(signUp));
authRoutes.post("/signin", asyncHandler(signIn));
