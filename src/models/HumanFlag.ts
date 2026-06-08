import mongoose, { InferSchemaType } from "mongoose";

const humanFlagSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, index: true },
    reason: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);

export type HumanFlagDocument = InferSchemaType<typeof humanFlagSchema>;

export const HumanFlag =
  mongoose.models.HumanFlag || mongoose.model("HumanFlag", humanFlagSchema);
