import mongoose from "mongoose";
import { Request, Response } from "express";

export function healthController(_req: Request, res: Response): void {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
}

