import { Table, Column, ForeignKey, DataType } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Product } from "./Product";
import { Category } from "./Category";

interface ProductCategoryAttributes {
  id?: string;
  productId: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ProductCategoryCreationAttributes extends ProductCategoryAttributes {}

@Table({
  tableName: "product_categories",
  timestamps: true,
  paranoid: true,
})
export class ProductCategory extends BaseModel<
  ProductCategoryAttributes,
  ProductCategoryCreationAttributes
> {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare productId: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;
}
