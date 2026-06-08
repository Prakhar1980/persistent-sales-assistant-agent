import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(4000)
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;

export const evalResultSchema = z.object({
  groundedness: z.number().min(0).max(1),
  relevance: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  flagged: z.boolean(),
  reasoning: z.string().min(1)
});

export type EvalResult = z.infer<typeof evalResultSchema>;

