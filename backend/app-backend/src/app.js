import cors from "cors";
import express from "express";
import logger from "./middleware/logger.js";
import eventRoutes from "./routes/eventRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
