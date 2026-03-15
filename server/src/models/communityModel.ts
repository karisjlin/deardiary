import { pool } from "../config/db.js";
import { basePostQuery } from "./postModel.js";
import type { PostRecord } from "./postModel.js";

export interface CommunityRecord {
  id: number;
  name: string;
  created_at: string;
}

export const findOrCreateCommunity = async (name: string): Promise<CommunityRecord> => {
  const normalized = name.toLowerCase();
  await pool.query(
    `INSERT INTO communities (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [normalized]
  );
  const result = await pool.query<CommunityRecord>(
    `SELECT * FROM communities WHERE name = $1`,
    [normalized]
  );
  return result.rows[0];
};

export const listCommunityPosts = async (
  communityName: string,
  viewerId: number | null,
  sort: "recent" | "top"
): Promise<PostRecord[]> => {
  const orderBy = sort === "top" ? "likes_count DESC, p.created_at DESC" : "p.created_at DESC";
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     WHERE $2 = ANY(p.community)
     GROUP BY p.id, u.id
     ORDER BY ${orderBy}`,
    [viewerId ?? 0, communityName.toLowerCase()]
  );
  return result.rows;
};

export const listAllCommunities = async (): Promise<(CommunityRecord & { post_count: number })[]> => {
  const result = await pool.query<CommunityRecord & { post_count: number }>(
    `SELECT c.*, COUNT(p.id)::int AS post_count
     FROM communities c
     LEFT JOIN posts p ON c.name = ANY(p.community)
     GROUP BY c.id
     ORDER BY c.name ASC`,
    []
  );
  return result.rows;
};
