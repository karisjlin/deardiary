import type { Request, Response } from "express";
import { z } from "zod";
import {
  createPost,
  findPostById,
  listPosts,
  toggleFavourite,
  toggleLike
} from "../models/postModel.js";

const createPostSchema = z.object({
  title: z.string().min(4).max(160),
  body: z.string().min(10).max(4000),
  communities: z.array(z.string().min(1).max(80)).min(1).default(["general"])
});

const postIdSchema = z.object({
  postId: z.coerce.number().int().positive()
});

export const getPosts = async (request: Request, response: Response) => {
  const posts = await listPosts(request.user?.id ?? null);
  return response.json(posts);
};

export const getPostById = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const post = await findPostById(postId, request.user?.id ?? null);

  if (!post) {
    return response.status(404).json({ message: "Post not found." });
  }

  return response.json(post);
};

export const addPost = async (request: Request, response: Response) => {
  const payload = createPostSchema.parse(request.body);
  await createPost(request.user!.id, payload.title, payload.body, payload.communities);
  const posts = await listPosts(request.user!.id);
  return response.status(201).json(posts[0]);
};

export const likePost = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const liked = await toggleLike(request.user!.id, postId);
  return response.json({ liked });
};

export const favouritePost = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const favourited = await toggleFavourite(request.user!.id, postId);
  return response.json({ favourited });
};
