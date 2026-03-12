import { pool } from "../config/db.js";

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  bio: string;
  created_at: string;
}

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
) => {
  const result = await pool.query<UserRecord>(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, password_hash, bio, created_at`,
    [username, email, passwordHash]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query<UserRecord>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
};

export const findUserById = async (id: number) => {
  const result = await pool.query<Omit<UserRecord, "password_hash">>(
    "SELECT id, username, email, bio, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
};

export const listUsers = async () => {
  const result = await pool.query<Omit<UserRecord, "password_hash">>(
    "SELECT id, username, email, bio, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};
