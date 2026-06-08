import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { catalogRouter } from "./routes/catalog.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { connectDatabase } from "./config/db.js";
import { HttpError } from "./utils/httpError.js";
import { logger } from "./utils/logger.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((_req, _res, next) => {
  connectDatabase().then(() => next()).catch(next);
});

app.use(healthRouter);
app.use(catalogRouter);
app.use(chatRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "route not found" });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  logger.error("Unhandled request error", error);
  res.status(500).json({ error: "internal server error" });
};

app.use(errorHandler);

export default app;
