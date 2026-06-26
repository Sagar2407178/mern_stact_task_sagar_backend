import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { sendResponse } from "../utils/response";

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();
      return sendResponse(
        res,
        200,
        "Categories fetched successfully",
        categories,
      );
    } catch (error) {
      next(error);
    }
  }
}
