import { Conversation } from "../models/Conversation.js";
import { Evaluation } from "../models/Evaluation.js";
import { HumanFlag } from "../models/HumanFlag.js";
import { MemoryMessage, MemoryRepository } from "./memoryRepository.js";

export class MongoMemoryRepository implements MemoryRepository {
  async getMemory(userId: string): Promise<MemoryMessage[]> {
    const rows = await Conversation.find({ userId }).sort({ createdAt: 1 }).lean();
    return rows.map((row) => ({
      role: row.role,
      content: row.message,
      session_id: row.sessionId,
      timestamp: row.createdAt
    }));
  }

  async saveMessage(params: {
    userId: string;
    role: "user" | "assistant";
    content: string;
    sessionId: string;
  }): Promise<void> {
    await Conversation.create({
      userId: params.userId,
      role: params.role,
      message: params.content,
      sessionId: params.sessionId
    });
  }

  async clearMemory(userId: string): Promise<number> {
    const result = await Conversation.deleteMany({ userId });
    await Evaluation.deleteMany({ userId });
    await HumanFlag.deleteMany({ userId });
    return result.deletedCount ?? 0;
  }
}

