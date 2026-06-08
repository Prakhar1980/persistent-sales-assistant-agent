import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/db.js";
import { logger } from "../src/utils/logger.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    logger.error("Vercel function failed before Express handled the request", error);
    return res.status(500).json({ error: "internal server error" });
  }
}

