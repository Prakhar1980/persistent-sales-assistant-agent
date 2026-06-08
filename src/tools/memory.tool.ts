import { getMemoryRepository } from "../memory/index.js";
import { MemoryMessage } from "../memory/memoryRepository.js";

export async function getUserMemory(userId: string): Promise<MemoryMessage[]> {
  return getMemoryRepository().getMemory(userId);
}

