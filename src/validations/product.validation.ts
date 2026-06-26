import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters long"),
    description: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative"),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
    categoryIds: z
      .array(z.string().uuid("Invalid category ID"))
      .min(1, "At least one category must be selected"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters long")
      .optional(),
    description: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative").optional(),
    stock: z.number().int().nonnegative("Stock cannot be negative").optional(),
    categoryIds: z
      .array(z.string().uuid("Invalid category ID"))
      .min(1, "At least one category must be selected")
      .optional(),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["createdAt", "name", "price", "stock"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),

    // Explicitly define filter fields and their supported suffixes
    categoryIds__in: z.union([z.string(), z.array(z.string())]).optional(),
    categoryIds: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type GetProductsQueryInput = z.infer<
  typeof getProductsQuerySchema
>["query"];
