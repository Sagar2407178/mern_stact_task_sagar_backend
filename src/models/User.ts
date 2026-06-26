import { Optional } from "sequelize";
import {
  Table,
  Column,
  DataType,
  IsEmail,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { BaseModel } from "./BaseModel";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true, // Enables soft deletes using deletedAt from BaseModel
})
export class User extends BaseModel<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }
}
