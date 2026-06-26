# 🔧 Backend — MERN Inventory System API

> A RESTful API built with **Node.js**, **Express 5**, **TypeScript**, **PostgreSQL**, and **Sequelize ORM**. Includes JWT authentication, Zod validation, and auto-generated Swagger docs.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
  - [Migrations](#migrations)
  - [Seeders](#seeders)
  - [Schema Overview](#schema-overview)
- [API Reference](#-api-reference)
  - [Health Check](#health-check)
  - [Authentication](#authentication-endpoints)
  - [Products](#product-endpoints)
  - [Categories](#category-endpoints)
- [Available Scripts](#-available-scripts)
- [Architecture](#-architecture)
- [Security](#-security)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | JavaScript runtime |
| Express.js | ^5.2.1 | HTTP server & routing |
| TypeScript | ^6.0.3 | Static typing |
| PostgreSQL | v14+ | Relational database |
| Sequelize | ^6.37.8 | ORM for database queries |
| sequelize-typescript | ^2.1.6 | Decorator-based Sequelize models |
| sequelize-cli | ^6.6.5 | Migrations & seeders CLI |
| jsonwebtoken | ^9.0.3 | JWT token generation & verification |
| bcrypt | ^6.0.0 | Password hashing |
| zod | ^4.4.3 | Runtime request schema validation |
| helmet | ^8.2.0 | Security HTTP response headers |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| morgan | ^1.11.0 | HTTP request logging |
| swagger-jsdoc | ^6.3.0 | OpenAPI spec from JSDoc comments |
| swagger-ui-express | ^5.0.1 | Swagger interactive UI |
| ts-node-dev | ^2.0.0 | Dev server with TypeScript hot-reload |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                      # Express app (middleware, routes, swagger setup)
│   ├── server.ts                   # Entry point — connects DB and starts server
│   ├── config/
│   │   └── swagger.ts              # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── auth.controller.ts      # register(), login(), getMe()
│   │   ├── product.controller.ts   # create(), getAll(), getById(), update(), delete()
│   │   └── category.controller.ts  # getAll()
│   ├── db/
│   │   ├── migrations/             # Sequelize CLI migration files (run in order)
│   │   │   ├── 20260627000001-create-users.js
│   │   │   ├── 20260627000002-create-categories.js
│   │   │   ├── 20260627000003-create-products.js
│   │   │   └── 20260627000004-create-product-categories.js
│   │   └── seeders/                # Seed data (categories, sample products)
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Verifies JWT and attaches user to req
│   │   ├── error.middleware.ts      # Global Express error handler
│   │   └── validate.middleware.ts   # Zod schema validation for body/query
│   ├── models/
│   │   ├── BaseModel.ts            # Abstract base with createdAt/updatedAt
│   │   ├── User.ts                 # User model (id, name, email, password)
│   │   ├── Category.ts             # Category model (id, name)
│   │   ├── Product.ts              # Product model (id, name, desc, price, stock)
│   │   ├── ProductCategory.ts      # Join table model (productId, categoryId)
│   │   └── index.ts                # Barrel export for all models
│   ├── routes/
│   │   ├── auth.routes.ts          # POST /register, POST /login, GET /me
│   │   ├── product.routes.ts       # Full CRUD on /products (all protected)
│   │   └── category.routes.ts      # GET /categories (protected)
│   ├── services/                   # Business logic (called by controllers)
│   ├── utils/                      # Shared utility helpers
│   └── validations/
│       ├── auth.validation.ts      # Zod schemas: registerSchema, loginSchema
│       └── product.validation.ts   # Zod schemas: createProductSchema, updateProductSchema, querySchema
├── .env                            # Environment variables (never commit this)
├── .sequelizerc                    # Tells sequelize-cli where migrations/models live
├── package.json
└── tsconfig.json
```

---

## ✅ Prerequisites

| Tool | Minimum Version |
|---|---|
| **Node.js** | v18.0.0 |
| **npm** | v9.0.0 |
| **PostgreSQL** | v14+ |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create the PostgreSQL database

```sql
-- Run in psql, pgAdmin, or any PostgreSQL client
CREATE DATABASE inventory_db;
```

### 3. Set up environment variables

Create a `.env` file in the `backend/` root (see [Environment Variables](#-environment-variables) below).

### 4. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Seed the database

```bash
npx sequelize-cli db:seed:all
```

### 6. Start the development server

```bash
npm run dev
```

The API will be live at: **`http://localhost:5000`**

> **Interactive API Docs (Swagger UI):** `http://localhost:5000/api-docs`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=inventory_db
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=1d
```

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | ✅ | Port for Express server | `5000` |
| `NODE_ENV` | ✅ | Runtime environment | `development` |
| `DB_HOST` | ✅ | PostgreSQL hostname | `localhost` |
| `DB_PORT` | ✅ | PostgreSQL port | `5432` |
| `DB_USER` | ✅ | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | ✅ | PostgreSQL password | `postgres` |
| `DB_NAME` | ✅ | Database name | `inventory_db` |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (≥32 chars) | `super_long_secret...` |
| `JWT_EXPIRES_IN` | ✅ | JWT expiry time | `1d`, `7d`, `2h` |


---

## 🗄 Database

### Migrations

Migrations live in `src/db/migrations/` and are executed by `sequelize-cli` in timestamp order.

| File | Table Created | Description |
|---|---|---|
| `20260627000001-create-users.js` | `users` | Stores user accounts |
| `20260627000002-create-categories.js` | `categories` | Product categories |
| `20260627000003-create-products.js` | `products` | Inventory items |
| `20260627000004-create-product-categories.js` | `product_categories` | Many-to-many join table |

**Migration commands:**

```bash
# Apply all pending migrations
npx sequelize-cli db:migrate

# Undo the most recent migration
npx sequelize-cli db:migrate:undo

# Undo all migrations (wipes schema)
npx sequelize-cli db:migrate:undo:all
```

### Seeders

```bash
# Seed all data (categories + sample products)
npx sequelize-cli db:seed:all

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

### Schema Overview

```
+------------------+        +------------------------+        +-----------------+
|      users       |        |        products         |        |   categories    |
+------------------+        +------------------------+        +-----------------+
| id           PK  |        | id               PK    |        | id           PK |
| name         str |        | name             str   |        | name         str|
| email        str |        | description      text  |        | createdAt       |
| password     str |        | price            dec   |        | updatedAt       |
| createdAt        |        | stock            int   |        +--------+--------+
| updatedAt        |        | createdAt              |                 |
+------------------+        | updatedAt              |                 |
                            +----------+-------------+                 |
                                       |                               |
                                       +---------------+---------------+
                                                       |
                                    +------------------+-----------------+
                                    |         product_categories         |
                                    +------------------------------------+
                                    | productId   FK -> products.id      |
                                    | categoryId  FK -> categories.id    |
                                    +------------------------------------+
```

**Relationships:**
- A **Product** belongs to many **Categories** (through `product_categories`)
- A **Category** has many **Products** (through `product_categories`)
- **Users** are independent — they own the session, not the products (in this version)

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

**Swagger UI:** `http://localhost:5000/api-docs`

> Routes marked 🔒 require: `Authorization: Bearer <your_jwt_token>`

---

### Health Check

#### `GET /api/health`

Verify the server is running.

**Response `200`:**
```json
{
  "success": true,
  "message": "Server is up and running!"
}
```

---

### Authentication Endpoints

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePass123"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | Non-empty |
| `email` | string | ✅ | Valid email format |
| `password` | string | ✅ | Minimum 6 characters |

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `400` | Validation failed (missing/invalid fields) |
| `400` | Email already registered |

---

#### `POST /api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securePass123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `400` | Validation failed |
| `401` | Invalid email or password |

---

#### `GET /api/auth/me` 🔒

Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `401` | Token missing, expired, or invalid |

---

### Product Endpoints

All product routes require a valid JWT (`Authorization: Bearer <token>`).

---

#### `POST /api/products` 🔒

Create a new product.

**Request Body:**
```json
{
  "name": "Wireless Keyboard",
  "description": "Compact Bluetooth keyboard with long battery life",
  "price": 49.99,
  "stock": 150,
  "categoryIds": [1, 3]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | Non-empty |
| `description` | string | ✅ | Non-empty |
| `price` | number | ✅ | Positive decimal |
| `stock` | number | ✅ | Non-negative integer |
| `categoryIds` | number[] | ✅ | Array of valid category IDs |

**Success Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Wireless Keyboard",
    "description": "Compact Bluetooth keyboard with long battery life",
    "price": "49.99",
    "stock": 150,
    "categories": [
      { "id": 1, "name": "Electronics" },
      { "id": 3, "name": "Accessories" }
    ],
    "createdAt": "2026-06-27T00:00:00.000Z",
    "updatedAt": "2026-06-27T00:00:00.000Z"
  }
}
```

---

#### `GET /api/products` 🔒

Get a paginated, filtered, and sorted list of products.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (1-based) |
| `limit` | integer | `10` | Items per page |
| `sortBy` | string | `name` | Sort field: `name`, `price`, or `stock` |
| `sortOrder` | string | `asc` | Sort direction: `asc` or `desc` |
| `categoryIds` | string | — | Comma-separated IDs, e.g. `1,3,5` |

**Example Request:**
```
GET /api/products?page=1&limit=5&sortBy=price&sortOrder=desc&categoryIds=1,3
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 7,
        "name": "Mechanical Keyboard",
        "description": "...",
        "price": "89.99",
        "stock": 75,
        "categories": [{ "id": 1, "name": "Electronics" }]
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 9
  }
}
```

---

#### `GET /api/products/:id` 🔒

Fetch a single product by its numeric ID.

**URL Params:** `id` — integer

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Wireless Keyboard",
    "description": "Compact Bluetooth keyboard with long battery life",
    "price": "49.99",
    "stock": 150,
    "categories": [
      { "id": 1, "name": "Electronics" },
      { "id": 3, "name": "Accessories" }
    ]
  }
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `404` | No product found with the given ID |
| `401` | Not authenticated |

---

#### `PUT /api/products/:id` 🔒

Update an existing product. All body fields are **optional** — only include what you want to change.

**Request Body (partial example):**
```json
{
  "price": 59.99,
  "stock": 120,
  "categoryIds": [1]
}
```

**Success Response `200`:** Returns the fully updated product object (same shape as GET by ID).

**Error Responses:**

| Code | Reason |
|---|---|
| `400` | Validation failed |
| `404` | Product not found |
| `401` | Not authenticated |

---

#### `DELETE /api/products/:id` 🔒

Delete a product permanently.

**URL Params:** `id` — integer

**Success Response `204`:** No body content.

**Error Responses:**

| Code | Reason |
|---|---|
| `404` | Product not found |
| `401` | Not authenticated |

---

### Category Endpoints

#### `GET /api/categories` 🔒

Get all available categories (used to populate dropdowns in the frontend).

**Success Response `200`:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Electronics" },
    { "id": 2, "name": "Clothing" },
    { "id": 3, "name": "Books" },
    { "id": 4, "name": "Accessories" }
  ]
}
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with TypeScript hot-reload via `ts-node-dev` |
| `build` | `npm run build` | Compile TypeScript → `dist/` folder |
| `start` | `npm run start` | Run the compiled production build from `dist/server.js` |
| `migrate` | `npm run migrate` | Alias for `sequelize-cli db:migrate` |
| `migrate:undo` | `npm run migrate:undo` | Alias for `sequelize-cli db:migrate:undo` |
| `seed` | `npm run seed` | Alias for `sequelize-cli db:seed:all` |
| `seed:undo` | `npm run seed:undo` | Alias for `sequelize-cli db:seed:undo:all` |

---

## 🏗 Architecture

The backend follows a clean **layered architecture** where each layer has a single responsibility:

```
HTTP Request
    │
    ▼
┌─────────────────────────────────────────────┐
│  Routes  (auth.routes, product.routes, ...)  │  ← maps URL + method to handler
└─────────────────────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────┐
│  Middlewares                                  │
│  ├── validate.middleware  (Zod schemas)       │  ← reject bad input early
│  ├── auth.middleware      (JWT verify)        │  ← protect routes
│  └── error.middleware     (global catch-all)  │  ← centralized error responses
└─────────────────────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────┐
│  Controllers  (auth, product, category)       │  ← handle req/res, call services
└─────────────────────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────┐
│  Services                                    │  ← business logic, no req/res
└─────────────────────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────┐
│  Models  (Sequelize + sequelize-typescript)  │  ← PostgreSQL via ORM
└─────────────────────────────────────────────┘
```

**Key decisions:**

- **Migrations over `sync()`** — Explicit migration files give version-controlled, rollback-safe schema changes suitable for production.
- **Zod validation middleware** — Validating before the controller runs keeps controllers clean and reduces defensive boilerplate.
- **Swagger JSDoc annotations** — All routes are annotated with `@swagger` comments so the interactive API docs are always in sync with the code.
- **`router.use(authenticate)`** — Applying the auth middleware at the router level means every product/category route is protected without repeating the middleware on each one.

---

## 🔒 Security

| Concern | Tool | Details |
|---|---|---|
| HTTP headers | `helmet` | Sets CSP, HSTS, X-Frame-Options, etc. automatically |
| CORS | `cors` | Open in dev; restrict `origin` in production |
| Passwords | `bcrypt` | One-way hashed with automatic salting (cost factor 10+) |
| Authentication | `jsonwebtoken` | HS256-signed JWTs, configurable expiry |
| Input validation | `zod` | Strict schema parsing; unknown fields stripped |
| Logging | `morgan` | Logs all HTTP requests in `dev` format |

> For production, lock down `cors` to your frontend domain and set `NODE_ENV=production` to disable verbose stack traces in error responses.
