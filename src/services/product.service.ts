import { Op } from "sequelize";
import { Product, Category, ProductCategory } from "../models";
import { sequelize } from "../config/database";
import { AppError } from "../utils/AppError";
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQueryInput,
} from "../validations/product.validation";
import { buildQueryOptions } from "../utils/queryBuilder";

export class ProductService {
  static async createProduct(data: CreateProductInput) {
    const existing = await Product.findOne({ where: { name: data.name } });
    if (existing) {
      throw new AppError("Product with this name already exists", 409);
    }

    const t = await sequelize.transaction();

    try {
      const product = await Product.create(
        {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
        },
        { transaction: t },
      );

      // Verify categories exist
      const categories = await Category.findAll({
        where: { id: { [Op.in]: data.categoryIds } },
        transaction: t,
      });

      if (categories.length !== data.categoryIds.length) {
        throw new AppError("One or more categories do not exist", 400);
      }

      await product.$set("categories", categories, { transaction: t });

      await t.commit();

      return this.getProductById(product.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getAllProducts(query: GetProductsQueryInput) {
    const { where, order, limit, offset, page } = buildQueryOptions({
      query,
      searchableFields: ["name", "description"],
      defaultSortBy: "createdAt",
      defaultSortOrder: "DESC",
      defaultLimit: 10,
      excludeFields: ["categoryIds"],
    });

    const includeOptions: any = {
      model: Category,
      as: "categories",
      through: { attributes: [] }, // exclude junction table attributes
    };

    const catQuery = query.categoryIds__in || query.categoryIds;
    if (catQuery) {
      const catIds = Array.isArray(catQuery)
        ? catQuery
        : typeof catQuery === "string"
          ? catQuery.split(",")
          : [catQuery];
      includeOptions.where = { id: { [Op.in]: catIds } };
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [includeOptions],
      order,
      limit,
      offset,
      distinct: true, // required for findAndCountAll when including models
    });

    return {
      products: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (data.name && data.name !== product.name) {
      const existing = await Product.findOne({ where: { name: data.name } });
      if (existing) {
        throw new AppError("Product with this name already exists", 409);
      }
    }

    const t = await sequelize.transaction();

    try {
      await product.update(
        {
          name: data.name ?? product.name,
          description: data.description ?? product.description,
          price: data.price ?? product.price,
          stock: data.stock ?? product.stock,
        },
        { transaction: t },
      );

      if (data.categoryIds) {
        const categories = await Category.findAll({
          where: { id: { [Op.in]: data.categoryIds } },
          transaction: t,
        });

        if (categories.length !== data.categoryIds.length) {
          throw new AppError("One or more categories do not exist", 400);
        }

        await product.$set("categories", categories, { transaction: t });
      }

      await t.commit();
      return this.getProductById(product.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await product.destroy(); // Soft delete because of paranoid: true
    return null;
  }
}
