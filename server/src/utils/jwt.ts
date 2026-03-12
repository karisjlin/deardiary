import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
