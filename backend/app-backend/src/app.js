// app-backend/src/app.js
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";

import logger from "./middleware/logger.js";
import esewaRoutes from "./routes/esewaRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

app.use(logger);

app.use("/api/user", userRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);

app.use("/api/esewa", esewaRoutes);

app.use("/api/membership", membershipRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
