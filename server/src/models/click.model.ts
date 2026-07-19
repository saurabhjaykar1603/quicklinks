import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export interface IClick {
  link: Types.ObjectId;
  slug: string;
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ClickDocument = HydratedDocument<IClick>;

const clickSchema = new Schema<IClick>(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop"],
      required: true,
    },
    browser: {
      type: String,
      default: "Other",
    },
    os: {
      type: String,
      default: "Other",
    },
    referrer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Click = model<IClick>("Click", clickSchema);
