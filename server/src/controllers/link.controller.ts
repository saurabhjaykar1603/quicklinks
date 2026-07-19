import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseUserAgent } from "../utils/parseUserAgent.js";
import { linkRepository } from "../repositories/link.repository.js";
import { clickRepository } from "../repositories/click.repository.js";

// these clash with app/api routes, so they can never be slugs
const RESERVED_SLUGS = [
  "api",
  "fetch",
  "assets",
  "dashboard",
  "login",
  "register",
  "about",
];

const createLink = asyncHandler(async (req, res) => {
  const { url, slug } = req.body;

  if (!url || String(url).trim() === "") {
    throw new ApiError(400, "Url is required");
  }

  if (slug && RESERVED_SLUGS.includes(String(slug).toLowerCase())) {
    throw new ApiError(400, "This slug is reserved — pick another one");
  }

  const randomSlug = Math.random().toString(36).substring(2, 7);

  const savedLink = await linkRepository.create({
    url,
    slug: slug || randomSlug,
    owner: req.user?._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        shortUrl: `${process.env.BASE_URL}/${savedLink.slug}`,
      },
      "Link saved successfully"
    )
  );
});

const redirectLink = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const link = await linkRepository.findBySlug(slug);

  if (!link) {
    // fall through so client routes / static files still resolve in production
    return next();
  }

  await linkRepository.incrementClicks(slug);

  // record analytics without blocking the redirect
  const { device, browser, os } = parseUserAgent(req.get("user-agent"));
  clickRepository
    .create({
      link: link._id,
      slug: link.slug,
      device,
      browser,
      os,
      referrer: req.get("referer") || undefined,
    })
    .catch((err) => console.error("click tracking failed:", err));

  return res.redirect(link.url);
});

const fetchLinks = asyncHandler(async (req, res) => {
  const links = await linkRepository.findAllByOwner(req.user!._id);

  return res
    .status(200)
    .json(new ApiResponse(200, links, "Links fetched successfully"));
});

const deleteLink = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const deletedLink = await linkRepository.deleteBySlug(slug);

  if (!deletedLink) {
    throw new ApiError(404, "Link not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Link deleted successfully"));
});

export { createLink, redirectLink, fetchLinks, deleteLink };
