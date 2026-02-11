import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import editorRoutes from './routes/editorRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Middlewares */
app.use(cors({
     origin: 'http://localhost:5173', // frontend URL
    credentials: true,               // allow cookies 
}));
app.use(express.json());

/* Serve static certificate files */
app.use('/certificates', express.static(path.join(__dirname, '../certificates')));

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/notifications',notificationRoutes);
app.use("/api/certificates", certificateRoutes);
export default app;
