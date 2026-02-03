import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log("Starting server...");
    await connectDB();
    console.log("MongoDB connected successfully");
    
    const server = app.listen(PORT, () => {
      console.log(`✓ Server is listening on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ Auth endpoints: http://localhost:${PORT}/auth`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`✗ Port ${PORT} is already in use`);
      } else {
        console.error("✗ Server error:", error);
      }
      process.exit(1);
    });

    // Keep process alive
    process.on("SIGINT", () => {
      console.log("\nShutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

console.log("Initializing application...");
startServer();
