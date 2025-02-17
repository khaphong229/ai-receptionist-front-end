import mongoose, { Document, Schema } from "mongoose";

interface IEmail extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IEmail>(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IEmail>("Post", postSchema);
