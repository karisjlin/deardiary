import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { z } from "zod";
import { findUserById, findUserByUsername, listUsers, updateUserPassword } from "../models/userModel.js";
import { listFavouredPostsByUser, listLikedPostsByUser, listPostsByUser } from "../models/postModel.js";

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

export const getMyPosts = async (request: Request, response: Response) => {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ message: "Authentication required." });
  const posts = await listPostsByUser(userId, userId);
  return response.json(posts);
};

export const getMyLikedPosts = async (request: Request, response: Response) => {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ message: "Authentication required." });
  const posts = await listLikedPostsByUser(userId, userId);
  return response.json(posts);
};

export const getMyFavouredPosts = async (request: Request, response: Response) => {
  const userId = request.user?.id;
  if (!userId) return response.status(401).json({ message: "Authentication required." });
  const posts = await listFavouredPostsByUser(userId, userId);
  return response.json(posts);
};

export const getUserProfile = async (request: Request, response: Response) => {
  const username = request.params.username as string;
  const user = await findUserByUsername(username);
  if (!user) return response.status(404).json({ message: "User not found." });
  return response.json(user);
};

export const getUserPosts = async (request: Request, response: Response) => {
  const username = request.params.username as string;
  const user = await findUserByUsername(username);
  if (!user) return response.status(404).json({ message: "User not found." });
  const viewerId = request.user?.id ?? null;
  const posts = await listPostsByUser(user.id, viewerId);
  return response.json(posts);
};

export const getUserLikedPosts = async (request: Request, response: Response) => {
  const username = request.params.username as string;
  const user = await findUserByUsername(username);
  if (!user) return response.status(404).json({ message: "User not found." });
  const viewerId = request.user?.id ?? null;
  const posts = await listLikedPostsByUser(user.id, viewerId);
  return response.json(posts);
};

export const getUserFavouredPosts = async (request: Request, response: Response) => {
  const username = request.params.username as string;
  const user = await findUserByUsername(username);
  if (!user) return response.status(404).json({ message: "User not found." });
  const viewerId = request.user?.id ?? null;
  const posts = await listFavouredPostsByUser(user.id, viewerId);
  return response.json(posts);
};
