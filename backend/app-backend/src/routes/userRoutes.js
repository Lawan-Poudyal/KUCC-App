import { requireAuth } from "@clerk/express";
import express from "express";
import { getProfile, syncUser } from "../controllers/userController.js";

const router = express.Router();

//desc get current user profile
//GET /api/user/profile
router.get("/profile", requireAuth(), getProfile);

//desc sync current user to db
//POST /api/user/sync

router.post("/sync", requireAuth(), syncUser);

export default router;
