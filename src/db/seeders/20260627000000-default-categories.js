"use strict";
const crypto = require("crypto");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        id: crypto.randomUUID(),
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Clothing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Books",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Home & Garden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        name: "Sports",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Bulk insert, but skip if they already exist (in case of re-running)
    // Unfortunately queryInterface.bulkInsert doesn't easily support 'ignoreDuplicates'.
    // We will just do a standard insert and assume the user runs it on a fresh DB,
    // or we can wrap it in a try-catch for unique constraint violations.
    try {
      await queryInterface.bulkInsert("categories", categories, {});
    } catch (error) {
      console.log("Categories already seeded or unique constraint failed.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
