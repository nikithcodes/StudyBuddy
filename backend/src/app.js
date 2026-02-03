import express from "express";
import cors from "cors";

const app = express();

/**
 * ✅ DEV CORS (allow all origins safely)
 * ✅ Handles browser + curl + preflight
 * ✅ Express v5 compatible
 */
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import helpRoutes from "./routes/help.routes.js";

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);
app.use("/help", helpRoutes);

// HEALTH
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
