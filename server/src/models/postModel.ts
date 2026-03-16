import { pool } from "../config/db.js";
import { findOrCreateCommunity } from "./communityModel.js";

export interface PostRecord {
  id: number;
  title: string;
  body: string;
  community: string[];
  created_at: string;
  author_id: number;
  author_username: string;
  likes_count: number;
  favourites_count: number;
  comments_count: number;
  liked_by_me: boolean;
  favourited_by_me: boolean;
}

export const basePostQuery = `
  SELECT
    p.id,
    p.title,
    p.body,
    p.community,
    p.created_at,
    u.id AS author_id,
    u.username AS author_username,
    COUNT(DISTINCT pl.user_id)::int AS likes_count,
    COUNT(DISTINCT f.user_id)::int AS favourites_count,
    COUNT(DISTINCT c.id)::int AS comments_count,
    COALESCE(BOOL_OR(pl.user_id = $1), false) AS liked_by_me,
    COALESCE(BOOL_OR(f.user_id = $1), false) AS favourited_by_me
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN post_likes pl ON pl.post_id = p.id
  LEFT JOIN favourites f ON f.post_id = p.id
  LEFT JOIN comments c ON c.post_id = p.id
`;

export const listPosts = async (viewerId: number | null, sort: "recent" | "top" = "recent") => {
  const orderBy = sort === "top" ? "likes_count DESC, p.created_at DESC" : "p.created_at DESC";
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     GROUP BY p.id, u.id
     ORDER BY ${orderBy}`,
    [viewerId ?? 0]
  );
  return result.rows;
};

export const findPostById = async (postId: number, viewerId: number | null) => {
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     WHERE p.id = $2
     GROUP BY p.id, u.id`,
    [viewerId ?? 0, postId]
  );
  return result.rows[0] ?? null;
};

export const createPost = async (
  userId: number,
  title: string,
  body: string,
  communities: string[]
) => {
  const normalized = communities.map((c) => c.trim().toLowerCase()).filter(Boolean);
  await Promise.all(normalized.map(findOrCreateCommunity));
  await pool.query(
    `INSERT INTO posts (user_id, title, body, community)
     VALUES ($1, $2, $3, $4)`,
    [userId, title, body, normalized]
  );
};

export const listPostsByUser = async (profileUserId: number, viewerId: number | null = null) => {
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     WHERE p.user_id = $2
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
    [viewerId ?? 0, profileUserId]
  );
  return result.rows;
};

export const listLikedPostsByUser = async (profileUserId: number, viewerId: number | null = null) => {
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     WHERE EXISTS (SELECT 1 FROM post_likes pl2 WHERE pl2.post_id = p.id AND pl2.user_id = $2)
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
    [viewerId ?? 0, profileUserId]
  );
  return result.rows;
};

export const listFavouredPostsByUser = async (profileUserId: number, viewerId: number | null = null) => {
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     WHERE EXISTS (SELECT 1 FROM favourites f2 WHERE f2.post_id = p.id AND f2.user_id = $2)
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
    [viewerId ?? 0, profileUserId]
  );
  return result.rows;
};

export const updatePost = async (
  postId: number,
  userId: number,
  title: string,
  body: string,
  communities: string[]
): Promise<boolean> => {
  const normalized = communities.map((c) => c.trim().toLowerCase()).filter(Boolean);
  await Promise.all(normalized.map(findOrCreateCommunity));
  const result = await pool.query(
    `UPDATE posts SET title = $1, body = $2, community = $3
     WHERE id = $4 AND user_id = $5`,
    [title, body, normalized, postId, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const deletePost = async (postId: number, userId: number): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM posts WHERE id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const toggleLike = async (userId: number, postId: number) => {
  const existing = await pool.query(
    "SELECT 1 FROM post_likes WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );

  if (existing.rowCount) {
    await pool.query(
      "DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    return false;
  }

  await pool.query(
    "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)",
    [userId, postId]
  );
  return true;
};

export const toggleFavourite = async (userId: number, postId: number) => {
  const existing = await pool.query(
    "SELECT 1 FROM favourites WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );

  if (existing.rowCount) {
    await pool.query(
      "DELETE FROM favourites WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    return false;
  }

  await pool.query(
    "INSERT INTO favourites (user_id, post_id) VALUES ($1, $2)",
    [userId, postId]
  );
  return true;
};
