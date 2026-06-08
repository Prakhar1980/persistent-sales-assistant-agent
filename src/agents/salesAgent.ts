import crypto from "node:crypto";
import { evaluateResponse, generateSalesResponse } from "../services/openai.service.js";
import { saveEvaluation } from "../services/evaluation.service.js";
import { getMemoryRepository } from "../memory/index.js";
import { searchCatalog } from "../tools/catalog.tool.js";
import { flagForHuman } from "../tools/humanFlag.tool.js";

export async function runSalesAgent(userId: string, message: string) {
  const sessionId = crypto.randomUUID();
  const toolsCalled: string[] = [];
  const memory = getMemoryRepository();

  const previousMessages = await memory.getMemory(userId);
  toolsCalled.push("getUserMemory");

  const catalogMatches = searchCatalog(message);
  toolsCalled.push("searchCatalog");

  const response = await generateSalesResponse({
    userId,
    message,
    memory: previousMessages,
    catalogMatches
  });

  const evalResult = await evaluateResponse({
    message,
    response,
    memory: previousMessages,
    catalogMatches
  });

  if (evalResult.flagged) {
    await flagForHuman(userId, evalResult.reasoning, sessionId);
    toolsCalled.push("flagForHuman");
  }

  await memory.saveMessage({ userId, role: "user", content: message, sessionId });
  await memory.saveMessage({ userId, role: "assistant", content: response, sessionId });
  await saveEvaluation({ userId, sessionId, evalResult });

  return {
    response,
    eval: evalResult,
    tools_called: toolsCalled,
    session_id: sessionId
  };
}

