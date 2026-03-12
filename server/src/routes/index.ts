import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { postRoutes } from "./postRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/posts", postRoutes);
apiRoutes.use("/users", userRoutes);
