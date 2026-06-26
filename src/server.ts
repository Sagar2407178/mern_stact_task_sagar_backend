import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/database";

const startServer = async () => {
  try {
    // 1. Authenticate Database Connection
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // Removed auto-sync to rely on manual migrations
    console.log("✅ Ready to accept connections.");

    // 4. Start Express Server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start the server:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
