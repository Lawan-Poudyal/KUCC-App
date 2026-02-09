import cors from "cors";
import express from "express";
import profileRoutes from "./routes/profile.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profile", profileRoutes);

export default app;
