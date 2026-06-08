import { HumanFlag } from "../models/HumanFlag.js";

export async function flagForHuman(
  userId: string,
  reason: string,
  sessionId?: string
): Promise<void> {
  await HumanFlag.create({ userId, reason, sessionId });
}

