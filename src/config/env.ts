import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  DB_HOST: z.string(),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(10, "JWT Secret must be at least 10 characters"),
  JWT_EXPIRES_IN: z.string().default("1d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:\n", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
