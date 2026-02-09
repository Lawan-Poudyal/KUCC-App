import express from 'express';
import { loginAdmin } from '../controllers/authController.js';

const router=express.Router();

// post /api/auth/login-> login
router.post('/login',loginAdmin);


export default router;