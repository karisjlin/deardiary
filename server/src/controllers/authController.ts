import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { z } from "zod";
import { createUser, findUserByEmail, findUserByUsername } from "../models/userModel.js";
import { signToken } from "../utils/jwt.js";

const authSchema = z.object({
  username: z.string().min(3).max(40).optional(),
  email: z.string().email(),
  password: z.string().min(6)
});

export const signUp = async (request: Request, response: Response) => {
  const payload = authSchema
    .extend({
      username: z.string().min(3).max(40)
    })
    .parse(request.body);

  const existingEmail = await findUserByEmail(payload.email);
  if (existingEmail) {
    return response.status(409).json({ message: "Email already in use." });
  }

  const existingUsername = await findUserByUsername(payload.username);
  if (existingUsername) {
    return response.status(409).json({ message: "Username already taken." });
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await createUser(payload.username, payload.email, passwordHash);
  const token = signToken({
    id: user.id,
    username: user.username,
    email: user.email
  });

  return response.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio
    }
  });
};

export const signIn = async (request: Request, response: Response) => {
  const payload = authSchema.parse(request.body);
  const user = await findUserByEmail(payload.email);

  if (!user) {
    return response.status(401).json({ message: "Invalid credentials." });
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password_hash);

  if (!passwordMatches) {
    return response.status(401).json({ message: "Invalid credentials." });
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    email: user.email
  });

  return response.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio
    }
  });
};
