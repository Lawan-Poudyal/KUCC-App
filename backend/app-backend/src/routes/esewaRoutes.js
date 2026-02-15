import express from "express";
import {
    handleEsewaFailure,
    initiateEsewaPayment,
    verifyEsewaPayment,
} from "../controllers/esewaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initiate", authMiddleware, initiateEsewaPayment);
router.post("/verify", verifyEsewaPayment);
router.post("/failure", handleEsewaFailure);

export default router;
