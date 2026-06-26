import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

// Protect all category routes
router.use(authenticate);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Not authenticated
 */
router.get("/", CategoryController.getAll);

export default router;
