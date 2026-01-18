import express from 'express';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import { editorAccess } from '../controllers/editorController.js';

const router = express.Router();

router.get(
  '/access',
  requireAdmin(['editor', 'master']),
  editorAccess
);

export default router;
