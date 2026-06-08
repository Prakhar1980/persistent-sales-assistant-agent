import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  OPENAI_API_KEY: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional()
  ),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini")
});

export const env = envSchema.parse(process.env);
