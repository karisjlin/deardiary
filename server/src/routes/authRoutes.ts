import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signIn, signUp } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

authRoutes.post("/signup", authLimiter, asyncHandler(signUp));
authRoutes.post("/signin", authLimiter, asyncHandler(signIn));
