import { OpenAI } from "openai";
import { env } from "../config/env.js";
import { CatalogSearchResult } from "./catalog.service.js";
import { MemoryMessage } from "../memory/memoryRepository.js";
import { EvalResult, evalResultSchema } from "../validators/chat.validator.js";
import { logger } from "../utils/logger.js";

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export async function generateSalesResponse(params: {
  userId: string;
  message: string;
  memory: MemoryMessage[];
  catalogMatches: CatalogSearchResult[];
}): Promise<string> {
  if (!client) {
    return fallbackSalesResponse(params.catalogMatches);
  }

  try {
    const result = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a practical B2B SaaS sales assistant. Use only the product catalog and conversation memory provided. If the user asks for custom pricing, legal terms, refunds, or contract changes, say a human teammate should help."
        },
        {
          role: "user",
          content: JSON.stringify({
            user_id: params.userId,
            user_message: params.message,
            recent_memory: params.memory.slice(-12),
            catalog_matches: params.catalogMatches
          })
        }
      ]
    });

    return result.choices[0]?.message?.content?.trim() || fallbackSalesResponse(params.catalogMatches);
  } catch (error) {
    logger.warn("LLM response failed, using fallback", describeOpenAIError(error));
    return fallbackSalesResponse(params.catalogMatches);
  }
}

export async function evaluateResponse(params: {
  message: string;
  response: string;
  memory: MemoryMessage[];
  catalogMatches: CatalogSearchResult[];
}): Promise<EvalResult> {
  if (!client) {
    return fallbackEval(params.message, params.catalogMatches);
  }

  try {
    const result = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Return only JSON with groundedness, relevance, confidence, flagged, and reasoning. Scores must be numbers from 0 to 1. Flag risky, unsupported, legal, contract, refund, or custom pricing responses."
        },
        {
          role: "user",
          content: JSON.stringify({
            user_message: params.message,
            assistant_response: params.response,
            recent_memory: params.memory.slice(-6),
            catalog_matches: params.catalogMatches
          })
        }
      ]
    });

    const raw = result.choices[0]?.message?.content;
    if (!raw) {
      return fallbackEval(params.message, params.catalogMatches);
    }

    return evalResultSchema.parse(JSON.parse(raw));
  } catch (error) {
    logger.warn("LLM evaluation failed, using fallback", describeOpenAIError(error));
    return fallbackEval(params.message, params.catalogMatches);
  }
}

function describeOpenAIError(error: unknown): string {
  if (error && typeof error === "object") {
    const maybeError = error as { status?: number; code?: string; message?: string };
    return [maybeError.status, maybeError.code, maybeError.message].filter(Boolean).join(" - ");
  }

  return "unknown OpenAI error";
}

function fallbackSalesResponse(matches: CatalogSearchResult[]): string {
  if (matches.length === 0) {
    return "I could not find a close catalog match. We offer Starter, Growth, and Enterprise plans. Tell me your team size and needed features, and I can narrow it down.";
  }

  const best = matches[0];
  return `Based on the catalog, the ${best.name} plan looks relevant. It costs ${best.price} and includes ${best.all_features.join(", ")}.`;
}

function fallbackEval(message: string, matches: CatalogSearchResult[]): EvalResult {
  const riskyWords = ["discount", "contract", "legal", "refund", "custom", "negotiate"];
  const flagged = riskyWords.some((word) => message.toLowerCase().includes(word));

  return {
    groundedness: matches.length > 0 ? 0.84 : 0.55,
    relevance: matches.length > 0 ? 0.82 : 0.6,
    confidence: matches.length > 0 ? 0.78 : 0.45,
    flagged,
    reasoning: "Fallback evaluation used because OPENAI_API_KEY is missing or evaluation failed."
  };
}
