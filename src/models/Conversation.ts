import mongoose, { InferSchemaType } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true },
    sessionId: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export type ConversationDocument = InferSchemaType<typeof conversationSchema>;

export const Conversation =
  mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
