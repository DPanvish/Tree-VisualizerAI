import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
    res.send('Hello from the TreeView AI Backend!');
});
app.use('/api/auth', authRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});