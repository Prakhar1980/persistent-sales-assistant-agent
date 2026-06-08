import mongoose, { InferSchemaType } from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    groundedness: { type: Number, required: true, min: 0, max: 1 },
    relevance: { type: Number, required: true, min: 0, max: 1 },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    flagged: { type: Boolean, required: true, default: false },
    reasoning: { type: String, required: true }
  },
  { timestamps: true }
);

export type EvaluationDocument = InferSchemaType<typeof evaluationSchema>;

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);

