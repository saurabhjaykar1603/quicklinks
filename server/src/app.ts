import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { ApiError } from "./utils/ApiError.js";
import userRouter from "./routes/user.routes.js";
import linkRouter from "./routes/link.routes.js";
import statsRouter from "./routes/stats.routes.js";
import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/stats", statsRouter);
app.use("/", linkRouter);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "dist")));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
  });
}

// error handler: converts ApiError (and anything else thrown) into a JSON response
app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
);

export { app };
