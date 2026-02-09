import express from "express";
import { createNewItem, getItems } from "../controllers/itemController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-items", requireAuth(), (req, res) => {
  req.auth = requireAuth()(req, res, () => {});
  getItems(req, res);
});

router.post("/items", requireAuth(), (req, res) => {
  req.auth = requireAuth()(req, res, () => {});
  createNewItem(req, res);
});

export default router;
