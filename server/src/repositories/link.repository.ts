import { Types } from "mongoose";
import { Link, type LinkDocument } from "../models/link.model.js";

class LinkRepository {
  async create(data: {
    url: string;
    slug: string;
    owner?: Types.ObjectId;
  }): Promise<LinkDocument> {
    return await Link.create(data);
  }

  async findBySlug(slug: string): Promise<LinkDocument | null> {
    return await Link.findOne({ slug });
  }

  // owner's links + legacy links created before auth existed
  async findAllByOwner(ownerId: Types.ObjectId): Promise<LinkDocument[]> {
    return await Link.find({
      $or: [{ owner: ownerId }, { owner: { $exists: false } }],
    }).sort({ createdAt: -1 });
  }

  async incrementClicks(slug: string): Promise<void> {
    await Link.updateOne({ slug }, { $inc: { clicks: 1 } });
  }

  async deleteBySlug(slug: string): Promise<LinkDocument | null> {
    return await Link.findOneAndDelete({ slug });
  }
}

export const linkRepository = new LinkRepository();
