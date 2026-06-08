export type MemoryMessage = {
  role: "user" | "assistant";
  content: string;
  session_id: string;
  timestamp: Date;
};

export interface MemoryRepository {
  getMemory(userId: string): Promise<MemoryMessage[]>;
  saveMessage(params: {
    userId: string;
    role: "user" | "assistant";
    content: string;
    sessionId: string;
  }): Promise<void>;
  clearMemory(userId: string): Promise<number>;
}

