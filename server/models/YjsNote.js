import mongoose from "mongoose";

const YjsNoteSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    noteId: { type: String, required: true, index: true },
    yjsState: { type: Buffer, default: null },
    content: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

YjsNoteSchema.index({ userId: 1, noteId: 1 });

export default mongoose.models.YjsNote || mongoose.model("YjsNote", YjsNoteSchema);
