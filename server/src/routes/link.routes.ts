import { Router } from "express";
import {
  createLink,
  redirectLink,
  fetchLinks,
  deleteLink,
} from "../controllers/link.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes — client must be logged in (cookies carry the tokens)
router.route("/api/links").post(verifyJWT, createLink);
router.route("/fetch/links").get(verifyJWT, fetchLinks);
router.route("/api/links/:slug").delete(verifyJWT, deleteLink);

// public — short url redirect must work for everyone
// clean root url is the primary one; /api/:slug kept so old shared links keep working
router.route("/api/:slug").get(redirectLink);
router.route("/:slug").get(redirectLink);

export default router;
