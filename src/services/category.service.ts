import { Category } from "../models";

export class CategoryService {
  static async getAllCategories() {
    return await Category.findAll({
      order: [["name", "ASC"]],
    });
  }
}
