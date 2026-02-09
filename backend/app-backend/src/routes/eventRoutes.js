import express from "express";
import { getAllPublishedEvents } from "../controllers/eventController.js";

const router = express.Router();

/* GET event */

router.get("/", getAllPublishedEvents);

export default router;
