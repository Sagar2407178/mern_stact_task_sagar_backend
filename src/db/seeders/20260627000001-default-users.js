"use strict";
const crypto = require("crypto");
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate a salt and hash the password explicitly since bulkInsert bypasses Model hooks
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const users = [
      {
        id: crypto.randomUUID(),
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    try {
      await queryInterface.bulkInsert("users", users, {});
    } catch (error) {
      console.log("Users already seeded or unique constraint failed.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "users",
      { email: ["admin@example.com", "test@example.com"] },
      {},
    );
  },
};
