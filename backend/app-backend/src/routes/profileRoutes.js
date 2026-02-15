//src/routes/profileRoutes.js

import express from "express";
import { getProfile, updateProfile } from "../controllers/profileCOntroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/update", authMiddleware, upload.single("image"), updateProfile);

export default router;
