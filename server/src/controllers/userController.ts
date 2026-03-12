import type { Request, Response } from "express";
import { findUserById, listUsers } from "../models/userModel.js";

export const getCurrentUser = async (request: Request, response: Response) => {
  const userId = request.user?.id;

  if (!userId) {
    return response.status(401).json({ message: "Authentication required." });
  }

  const user = await findUserById(userId);

  if (!user) {
    return response.status(404).json({ message: "User not found." });
  }

  return response.json(user);
};

export const getUsers = async (_request: Request, response: Response) => {
  const users = await listUsers();
  return response.json(users);
};
