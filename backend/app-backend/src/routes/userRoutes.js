import express from "express";
import { getProfile, syncUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

//desc get current user profile
//GET /api/user/profile
router.get("/profile", requireAuth(), (req, res) => {
  req.auth = requireAuth()(req, res, () => {}); // attach userId
  getProfile(req, res);
});

//desc get current user profile
//GET /api/user/profile

router.post("/sync", requireAuth(), (req, res) => {
  req.auth = requireAuth()(req, res, () => {});
  syncUser(req, res);
});

export default router;
