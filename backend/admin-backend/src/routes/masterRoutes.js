import express from 'express';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import {
  masterAccess,
  getAllAdmins,
  updateAdmin,
  createAdmin,
} from '../controllers/masterController.js';

const router = express.Router();

/**
 * Master access check
 */
router.get(
  '/access',
  requireAdmin(['master']),
  masterAccess
);

/**
 * Get all admins (master only)
 */
router.get(
  '/admins',
  requireAdmin(['master']),
  getAllAdmins
);

/**
 * Update admin role or status
 */
router.put(
  '/admins/:id',
  requireAdmin(['master']),
  updateAdmin
);

// used to create new admin in AdminManagement.jsx file
router.post(
  '/admins',
  requireAdmin(['master']),
  createAdmin
);
export default router;
