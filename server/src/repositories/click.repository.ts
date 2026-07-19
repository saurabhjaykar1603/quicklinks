import { Types } from "mongoose";
import { Click, type IClick, type ClickDocument } from "../models/click.model.js";

const matchStage = (linkIds: Types.ObjectId[], since?: Date) => ({
  link: { $in: linkIds },
  ...(since ? { createdAt: { $gte: since } } : {}),
});

class ClickRepository {
  async create(data: {
    link: Types.ObjectId;
    slug: string;
    device: IClick["device"];
    browser: string;
    os: string;
    referrer?: string;
  }): Promise<ClickDocument> {
    return await Click.create(data);
  }

  async totalCount(linkIds: Types.ObjectId[], since?: Date): Promise<number> {
    return await Click.countDocuments(matchStage(linkIds, since));
  }

  async countByDevice(linkIds: Types.ObjectId[], since?: Date) {
    return await Click.aggregate<{ _id: string; count: number }>([
      { $match: matchStage(linkIds, since) },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async countByBrowser(linkIds: Types.ObjectId[], since?: Date) {
    return await Click.aggregate<{ _id: string; count: number }>([
      { $match: matchStage(linkIds, since) },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async countBySlug(linkIds: Types.ObjectId[], since?: Date) {
    return await Click.aggregate<{ _id: string; count: number }>([
      { $match: matchStage(linkIds, since) },
      { $group: { _id: "$slug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async clicksByDay(linkIds: Types.ObjectId[], days: number) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    return await Click.aggregate<{ _id: string; count: number }>([
      { $match: { link: { $in: linkIds }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}

export const clickRepository = new ClickRepository();
