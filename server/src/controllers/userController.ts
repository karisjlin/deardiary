import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { z } from "zod";
import { findUserById, listUsers, updateUserPassword } from "../models/userModel.js";

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

export const changePassword = async (request: Request, response: Response) => {
  const userId = request.user?.id;

  if (!userId) {
    return response.status(401).json({ message: "Authentication required." });
  }

  const { newPassword } = z.object({ newPassword: z.string().min(6) }).parse(request.body);
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(userId, passwordHash);

  return response.json({ message: "Password updated." });
};

export const getUsers = async (_request: Request, response: Response) => {
  const users = await listUsers();
  return response.json(users);
};
