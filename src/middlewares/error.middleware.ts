import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let data = null;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    data = err.issues;
  } else if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Resource already exists";
    data = err.errors.map((e: any) => e.message);
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};
