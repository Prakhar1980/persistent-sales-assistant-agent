import { Router } from "express";
import {
  deleteChatMemory,
  getChatEvals,
  getChatHistory,
  postChat
} from "../controllers/chat.controller.js";

export const chatRouter = Router();

chatRouter.post("/chat/:userId", postChat);
chatRouter.get("/chat/:userId/history", getChatHistory);
chatRouter.delete("/chat/:userId/memory", deleteChatMemory);
chatRouter.get("/chat/:userId/evals", getChatEvals);

