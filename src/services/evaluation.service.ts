import { Evaluation } from "../models/Evaluation.js";
import { EvalResult } from "../validators/chat.validator.js";

export async function saveEvaluation(params: {
  userId: string;
  sessionId: string;
  evalResult: EvalResult;
}): Promise<void> {
  await Evaluation.create({
    userId: params.userId,
    sessionId: params.sessionId,
    groundedness: params.evalResult.groundedness,
    relevance: params.evalResult.relevance,
    confidence: params.evalResult.confidence,
    flagged: params.evalResult.flagged,
    reasoning: params.evalResult.reasoning
  });
}

export async function getEvaluationSummary(userId: string) {
  const rows = await Evaluation.find({ userId }).sort({ createdAt: 1 }).lean();

  if (rows.length === 0) {
    return {
      user_id: userId,
      total_evaluations: 0,
      average_groundedness: 0,
      average_relevance: 0,
      average_confidence: 0,
      flagged_count: 0,
      latest: null
    };
  }

  const total = rows.length;
  const latest = rows[rows.length - 1];

  return {
    user_id: userId,
    total_evaluations: total,
    average_groundedness: round(rows.reduce((sum, row) => sum + row.groundedness, 0) / total),
    average_relevance: round(rows.reduce((sum, row) => sum + row.relevance, 0) / total),
    average_confidence: round(rows.reduce((sum, row) => sum + row.confidence, 0) / total),
    flagged_count: rows.filter((row) => row.flagged).length,
    latest: {
      groundedness: latest.groundedness,
      relevance: latest.relevance,
      confidence: latest.confidence,
      flagged: latest.flagged,
      reasoning: latest.reasoning
    }
  };
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

