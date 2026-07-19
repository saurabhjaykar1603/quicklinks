import type { Types } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { linkRepository } from "../repositories/link.repository.js";
import { clickRepository } from "../repositories/click.repository.js";

// ?range=7d | 30d | all  (default 7d)
const parseRange = (raw: unknown) => {
  const rangeParam = String(raw || "7d");
  const rangeDays = rangeParam === "30d" ? 30 : rangeParam === "all" ? null : 7;

  let since: Date | undefined;
  if (rangeDays) {
    since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (rangeDays - 1));
  }

  return { rangeParam, chartDays: rangeDays ?? 30, since };
};

// fill missing days with 0 so the chart always shows the full window
const fillDays = (
  byDay: { _id: string; count: number }[],
  chartDays: number
) => {
  const byDayMap = new Map(byDay.map((d) => [d._id, d.count]));
  const clicksByDay: { date: string; count: number }[] = [];
  for (let i = chartDays - 1; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    clicksByDay.push({ date: key, count: byDayMap.get(key) ?? 0 });
  }
  return clicksByDay;
};

const getOverview = asyncHandler(async (req, res) => {
  const { rangeParam, chartDays, since } = parseRange(req.query.range);

  const links = await linkRepository.findAllByOwner(req.user!._id);
  const linkIds = links.map((link) => link._id);

  const [totalTracked, devices, browsers, bySlug, byDay] = await Promise.all([
    clickRepository.totalCount(linkIds, since),
    clickRepository.countByDevice(linkIds, since),
    clickRepository.countByBrowser(linkIds, since),
    clickRepository.countBySlug(linkIds, since),
    clickRepository.clicksByDay(linkIds, chartDays),
  ]);

  // clicks column on links covers clicks recorded before tracking existed
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  const perLink = links
    .map((link) => ({
      slug: link.slug,
      url: link.url,
      clicks: link.clicks,
      tracked: bySlug.find((s) => s._id === link.slug)?.count ?? 0,
      createdAt: link.createdAt,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  const topLink = perLink[0] ?? null;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        range: rangeParam,
        totals: {
          totalLinks: links.length,
          totalClicks,
          totalTracked,
          topLink,
        },
        perLink,
        devices: devices.map((d) => ({ device: d._id, count: d.count })),
        browsers: browsers.map((b) => ({ browser: b._id, count: b.count })),
        clicksByDay: fillDays(byDay, chartDays),
      },
      "Stats fetched successfully"
    )
  );
});

const getLinkStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { rangeParam, chartDays, since } = parseRange(req.query.range);

  const link = await linkRepository.findBySlug(slug);

  if (!link) {
    throw new ApiError(404, "Link not found");
  }

  // legacy links have no owner; owned links are visible to their owner only
  if (link.owner && String(link.owner) !== String(req.user!._id)) {
    throw new ApiError(403, "You do not have access to this link");
  }

  const linkIds: Types.ObjectId[] = [link._id];

  const [totalTracked, devices, browsers, byDay] = await Promise.all([
    clickRepository.totalCount(linkIds, since),
    clickRepository.countByDevice(linkIds, since),
    clickRepository.countByBrowser(linkIds, since),
    clickRepository.clicksByDay(linkIds, chartDays),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        range: rangeParam,
        link: {
          slug: link.slug,
          url: link.url,
          clicks: link.clicks,
          createdAt: link.createdAt,
        },
        totals: {
          totalClicks: link.clicks,
          totalTracked,
        },
        devices: devices.map((d) => ({ device: d._id, count: d.count })),
        browsers: browsers.map((b) => ({ browser: b._id, count: b.count })),
        clicksByDay: fillDays(byDay, chartDays),
      },
      "Link stats fetched successfully"
    )
  );
});

export { getOverview, getLinkStats };
