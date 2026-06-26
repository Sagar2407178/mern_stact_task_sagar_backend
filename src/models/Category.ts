import { Optional } from "sequelize";
import {
  Table,
  Column,
  DataType,
  Unique,
  BelongsToMany,
} from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import { Product } from "./Product";
import { ProductCategory } from "./ProductCategory";

interface CategoryAttributes {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<
  CategoryAttributes,
  "id"
> {}

@Table({
  tableName: "categories",
  timestamps: true,
  paranoid: true,
})
export class Category extends BaseModel<
  CategoryAttributes,
  CategoryCreationAttributes
> {
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @BelongsToMany(() => Product, () => ProductCategory)
  declare products?: Product[];
}
