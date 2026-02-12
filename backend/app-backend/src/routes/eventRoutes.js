// app-backend/src/routes/eventRoutes.js

import express from "express";
import {
    getAllPublishedEvents,
    getEventbyID,
    registerForEvent,
} from "../controllers/eventController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET event */
router.get("/", getAllPublishedEvents);
// GET event by id
router.get("/:id", getEventbyID);
// POST /api/events/registe
// @desc register for event
router.post("/register", authMiddleware, registerForEvent);

export default router;
