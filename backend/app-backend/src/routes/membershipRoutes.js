import express from "express";
import {
    becomeMember,
    checkMembershipStatus,
} from "../controllers/membershipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/become", authMiddleware, becomeMember);
router.get("/status", authMiddleware, checkMembershipStatus);

export default router;
