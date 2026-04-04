import type { Request, Response } from "express";
import { z } from "zod";
import {
  createPost,
  deletePost,
  findPostById,
  listPosts,
  searchPostsByQuery,
  toggleFavourite,
  toggleLike,
  updatePost
} from "../models/postModel.js";

const createPostSchema = z.object({
  title: z.string().min(4).max(160),
  body: z.string().min(10).max(4000),
  communities: z.array(z.string().min(1).max(80)).min(1).default(["general"])
});

const postIdSchema = z.object({
  postId: z.coerce.number().int().positive()
});

const sortSchema = z.enum(["recent", "top"]).default("recent");
const searchQuerySchema = z.object({ q: z.string().min(1).max(200) });

export const searchPosts = async (request: Request, response: Response) => {
  const { q } = searchQuerySchema.parse(request.query);
  const posts = await searchPostsByQuery(q, request.user?.id ?? null);
  return response.json(posts);
};

export const getPosts = async (request: Request, response: Response) => {
  const sort = sortSchema.parse(request.query.sort ?? "recent");
  const posts = await listPosts(request.user?.id ?? null, sort);
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
  const postId = await createPost(request.user!.id, payload.title, payload.body, payload.communities);
  const post = await findPostById(postId, request.user!.id);
  return response.status(201).json(post);
};

const editPostSchema = z.object({
  title: z.string().min(4).max(160),
  body: z.string().min(10).max(4000),
  communities: z.array(z.string().min(1).max(80)).min(1)
});

export const editPost = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const payload = editPostSchema.parse(request.body);
  const updated = await updatePost(postId, request.user!.id, payload.title, payload.body, payload.communities);
  if (!updated) return response.status(404).json({ message: "Post not found or not yours." });
  const post = await findPostById(postId, request.user!.id);
  return response.json(post);
};

export const removePost = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const deleted = await deletePost(postId, request.user!.id);
  if (!deleted) return response.status(404).json({ message: "Post not found or not yours." });
  return response.status(204).send();
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
