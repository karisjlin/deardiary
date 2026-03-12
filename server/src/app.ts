import cors from "cors";
import express from "express";
import { checkDatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRoutes } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL
  })
);
app.use(express.json());

app.get("/health", async (_request, response, next) => {
  try {
    await checkDatabaseConnection();
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/api", apiRoutes);
app.use(errorHandler);
