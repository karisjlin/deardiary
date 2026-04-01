import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10).refine(
    (val) => val !== "replace_with_secure_secret",
    { message: "JWT_SECRET must be changed from the default value." }
  ),
  CLIENT_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
