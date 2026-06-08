import { Request, Response } from "express";
import { runSalesAgent } from "../agents/salesAgent.js";
import { getMemoryRepository } from "../memory/index.js";
import { getEvaluationSummary } from "../services/evaluation.service.js";
import { chatRequestSchema } from "../validators/chat.validator.js";
import { HttpError } from "../utils/httpError.js";

export async function postChat(req: Request, res: Response): Promise<void> {
  const userId = readUserId(req);
  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new HttpError(400, "message is required and must be a non-empty string");
  }

  const result = await runSalesAgent(userId, parsed.data.message);
  res.json(result);
}

export async function getChatHistory(req: Request, res: Response): Promise<void> {
  const userId = readUserId(req);
  const messages = await getMemoryRepository().getMemory(userId);
  res.json({ user_id: userId, messages });
}

export async function deleteChatMemory(req: Request, res: Response): Promise<void> {
  const userId = readUserId(req);
  const deletedMessages = await getMemoryRepository().clearMemory(userId);
  res.json({ user_id: userId, deleted_messages: deletedMessages });
}

export async function getChatEvals(req: Request, res: Response): Promise<void> {
  const userId = readUserId(req);
  const summary = await getEvaluationSummary(userId);
  res.json(summary);
}

function readUserId(req: Request): string {
  const value = req.params.userId;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, "userId is required");
  }
  return value;
}
