import { pool } from "../config/db.js";

export interface CommentRecord {
  id: number;
  post_id: number;
  user_id: number;
  author_username: string;
  body: string;
  created_at: string;
}

export const listCommentsByPost = async (postId: number): Promise<CommentRecord[]> => {
  const result = await pool.query<CommentRecord>(
    `SELECT c.id, c.post_id, c.user_id, u.username AS author_username, c.body, c.created_at
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return result.rows;
};

export const createComment = async (
  postId: number,
  userId: number,
  body: string
): Promise<CommentRecord> => {
  const result = await pool.query<CommentRecord>(
    `INSERT INTO comments (post_id, user_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, user_id, body, created_at`,
    [postId, userId, body]
  );
  const row = result.rows[0];
  const userResult = await pool.query<{ username: string }>(
    "SELECT username FROM users WHERE id = $1",
    [userId]
  );
  return { ...row, author_username: userResult.rows[0].username };
};

export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM comments WHERE id = $1 AND user_id = $2",
    [commentId, userId]
  );
  return (result.rowCount ?? 0) > 0;
};
