import { Sequelize } from "sequelize-typescript";
import { env } from "./env";
import { User, Product, Category, ProductCategory } from "../models";

export const sequelize = new Sequelize({
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [User, Product, Category, ProductCategory],
});
