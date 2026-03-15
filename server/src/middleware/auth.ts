import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication required." });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    request.user = verifyToken(token);
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token." });
  }
};

export const optionalAuth = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      request.user = verifyToken(authHeader.replace("Bearer ", ""));
    } catch {
      // invalid token — proceed as unauthenticated
    }
  }
  return next();
};
