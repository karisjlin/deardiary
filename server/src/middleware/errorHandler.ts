import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error & { code?: string },
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  console.error(error);

  if (error.name === "ZodError") {
    return response.status(400).json({ message: "Invalid request payload." });
  }

  if (error.code === "ECONNREFUSED") {
    return response.status(503).json({
      message: "Database unavailable. Start PostgreSQL and try again."
    });
  }

  response.status(500).json({ message: "Internal server error." });
};
