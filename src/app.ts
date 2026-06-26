import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Global Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Request logging

// Basic Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is up and running!" });
});

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import { setupSwagger } from "./config/swagger";

// Setup Swagger Docs
setupSwagger(app);

// Import and mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Global Error Handler Middleware (must be the last middleware)
app.use(errorHandler);

export default app;
