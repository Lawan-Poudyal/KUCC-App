import express from 'express';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import { createNotification, deleteNotification, getNotifications, updateNotification } from '../controllers/notificationController.js';


const router=express.Router();

router.post('/',requireAdmin(['master','editor']),createNotification);

router.get("/",requireAdmin(['master','editor']), getNotifications);

router.put("/:id",requireAdmin(['master','editor']), updateNotification);

router.delete("/:id", requireAdmin(['master']),deleteNotification);

export default router;