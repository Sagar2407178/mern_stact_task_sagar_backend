import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError<any>;
        const message = zodError.issues
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return next(new AppError(`Validation Error: ${message}`, 400));
      }
      return next(error);
    }
  };
};
