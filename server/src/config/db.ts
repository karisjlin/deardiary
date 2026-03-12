import { Pool } from "pg";
import { env } from "./env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const checkDatabaseConnection = async () => {
  await pool.query("SELECT 1");
};
