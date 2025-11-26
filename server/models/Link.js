import { Schema, model } from "mongoose";

const linkSchema = new Schema({
  url: {
    type: "string",
    required: true,
  },

  slug: {
    type: "string",
    required: true,
    unique: true,
    lowercase: true
  },

  clicks: {
    type: Number,
    default: 0,
    require: true
  },
},{
  timestamps: true,
});

const Link = model("Link", linkSchema);
export default Link;
