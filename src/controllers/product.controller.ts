import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { sendResponse } from "../utils/response";

export class ProductController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return sendResponse(res, 201, "Product created successfully", product);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProductService.getAllProducts(req.query);
      return sendResponse(res, 200, "Products fetched successfully", data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(
        req.params.id as string,
      );
      return sendResponse(res, 200, "Product fetched successfully", product);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id as string,
        req.body,
      );
      return sendResponse(res, 200, "Product updated successfully", product);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id as string);
      return sendResponse(res, 200, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
