import { Request, Response, NextFunction } from "express";

/**
 * Global error handler. Express recognises this as an error handler
 * because it has FOUR parameters (err, req, res, next).
 *
 * Any controller that calls `throw err` or `next(err)` ends up here.
 * This means we never have to write try/catch for every single route —
 * only for cases where we want to handle a specific error ourselves
 * (like a UNIQUE constraint violation).
 *
 * Must be registered LAST in index.ts, after all routes.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  res.status(500).json({
    error: "Something went wrong on the server",
    // Only expose the actual error message in development
    detail: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
