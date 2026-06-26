import { Optional } from "sequelize";
import {
  Table,
  Column,
  DataType,
  Unique,
  BelongsToMany,
  Default,
} from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";

interface ProductAttributes {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ProductCreationAttributes extends Optional<
  ProductAttributes,
  "id" | "stock"
> {}

@Table({
  tableName: "products",
  timestamps: true,
  paranoid: true,
})
export class Product extends BaseModel<
  ProductAttributes,
  ProductCreationAttributes
> {
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stock: number;

  @BelongsToMany(() => Category, () => ProductCategory)
  declare categories?: Category[];
}
