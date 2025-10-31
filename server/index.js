// Load environment variables from a .env file into process.env
import 'dotenv/config';

// Import necessary libraries
import express from 'express';
import cors from 'cors';
import prisma from './lib/db.js';

// Import route handlers
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import chatRoutes from './routes/chat.js';

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
app.use(cors());

// Parse incoming JSON requests and place the parsed data in req.body.
app.use(express.json());

// --- API Routes ---

// A simple health check route to confirm the server is running.
app.get('/', (req, res) => {
    res.send('Hello from the TreeVisualizer AI Backend!');
});

// Mount the authentication, session, and chat routes under their respective paths.
app.use('/api/auth', authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
// Ensures that the Prisma client disconnects from the database when the server process is terminated.
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
    process.exit(0);
});