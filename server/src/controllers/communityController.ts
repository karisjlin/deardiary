import type { Request, Response } from "express";
import { z } from "zod";
import { listAllCommunities, listCommunityPosts } from "../models/communityModel.js";

const communityParamsSchema = z.object({
  name: z.string().min(1)
});

const sortSchema = z.enum(["recent", "top"]).default("recent");

export const getCommunityPosts = async (request: Request, response: Response) => {
  const { name } = communityParamsSchema.parse(request.params);
  const sort = sortSchema.parse(request.query.sort ?? "recent");
  const posts = await listCommunityPosts(name, request.user?.id ?? null, sort);
  return response.json(posts);
};

export const getCommunities = async (_request: Request, response: Response) => {
  const communities = await listAllCommunities();
  return response.json(communities);
};
