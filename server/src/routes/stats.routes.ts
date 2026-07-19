import { Router } from "express";
import { getOverview, getLinkStats } from "../controllers/stats.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/overview").get(verifyJWT, getOverview);
router.route("/link/:slug").get(verifyJWT, getLinkStats);

export default router;
