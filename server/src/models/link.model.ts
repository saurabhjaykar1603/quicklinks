import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export interface ILink {
  url: string;
  slug: string;
  clicks: number;
  owner?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LinkDocument = HydratedDocument<ILink>;

const linkSchema = new Schema<ILink>(
  {
    url: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    clicks: {
      type: Number,
      default: 0,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Link = model<ILink>("Link", linkSchema);
