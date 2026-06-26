import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendResponse } from "../utils/response";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.register(req.body);
      return sendResponse(res, 201, "User registered successfully", data);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.login(req.body);
      return sendResponse(res, 200, "User logged in successfully", data);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // The user is already attached to req by the authenticate middleware
      return sendResponse(res, 200, "User fetched successfully", {
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
