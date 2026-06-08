import { MongoMemoryRepository } from "./mongoMemoryRepository.js";
import { MemoryRepository } from "./memoryRepository.js";

export function getMemoryRepository(): MemoryRepository {
  return new MongoMemoryRepository();
}

