import { pool } from "../config/db.js";

export interface PostRecord {
  id: number;
  title: string;
  body: string;
  community: string;
  created_at: string;
  author_id: number;
  author_username: string;
  likes_count: number;
  favourites_count: number;
  liked_by_me: boolean;
  favourited_by_me: boolean;
}

const basePostQuery = `
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
    COALESCE(BOOL_OR(pl.user_id = $1), false) AS liked_by_me,
    COALESCE(BOOL_OR(f.user_id = $1), false) AS favourited_by_me
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN post_likes pl ON pl.post_id = p.id
  LEFT JOIN favourites f ON f.post_id = p.id
`;

export const listPosts = async (viewerId: number | null) => {
  const result = await pool.query<PostRecord>(
    `${basePostQuery}
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
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
  community: string
) => {
  await pool.query(
    `INSERT INTO posts (user_id, title, body, community)
     VALUES ($1, $2, $3, $4)`,
    [userId, title, body, community]
  );
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
