import type { Request, Response } from "express";
import { z } from "zod";
import {
  createComment,
  deleteComment,
  listCommentsByPost
} from "../models/commentModel.js";

const postIdSchema = z.object({ postId: z.coerce.number().int().positive() });
const commentIdSchema = z.object({ commentId: z.coerce.number().int().positive() });
const bodySchema = z.object({ body: z.string().min(1).max(2000) });

export const getComments = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const comments = await listCommentsByPost(postId);
  return response.json(comments);
};

export const addComment = async (request: Request, response: Response) => {
  const { postId } = postIdSchema.parse(request.params);
  const { body } = bodySchema.parse(request.body);
  const comment = await createComment(postId, request.user!.id, body);
  return response.status(201).json(comment);
};

export const removeComment = async (request: Request, response: Response) => {
  const { postId: _postId } = postIdSchema.parse(request.params);
  const { commentId } = commentIdSchema.parse(request.params);
  const deleted = await deleteComment(commentId, request.user!.id);

  if (!deleted) {
    return response.status(404).json({ message: "Comment not found or not yours." });
  }

  return response.status(204).send();
};
