import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import editorRoutes from './routes/editorRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'

const app = express();

/* Middlewares */
app.use(cors({
     origin: 'http://localhost:5173', // frontend URL
    credentials: true,               // allow cookies 
}));
app.use(express.json());

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/notifications',notificationRoutes);

export default app;
