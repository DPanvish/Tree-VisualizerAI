// Importing the Prisma client for database interactions
import prisma from "../lib/db.js";

// --- Get All Sessions Controller ---
// Retrieves a list of all saved sessions for the currently authenticated user.
export const getAllSessions = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch sessions, selecting only necessary fields for the list view.
        const sessions = await prisma.treeSession.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: "desc", // Show the most recent sessions first.
            }
        });

        res.status(200).json({ status: "success", message: "Sessions retrieved successfully", data: { sessions } });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to retrieve sessions", error: err.message });
    }
}

// --- Get Session by ID Controller ---
// Retrieves a single, specific session, including its full tree and chat history.
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Find the session by its ID.
        const session = await prisma.treeSession.findUnique({
            where: { id },
            include: {
                chatHistory: true, // Also include the associated chat history.
            },
        });

        // Ensure the session exists and belongs to the requesting user.
        if (!session || session.userId !== userId) {
            return res.status(404).json({ status: "error", message: "Session not found or access denied" });
        }

        res.status(200).json({ status: "success", message: "Session retrieved successfully", data: { session } });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to retrieve session", error: err.message });
    }
}

// --- Save New Session Controller ---
// Creates a new session with the provided tree state and chat messages.
export const saveNewSession = async (req, res) => {
    try {
        const { name, nodes, edges, chatMessages } = req.body;
        const userId = req.user.userId;

        // Create a new TreeSession and a related ChatHistory in a single transaction.
        const newSession = await prisma.treeSession.create({
            data: {
                name: name || "My New Tree",
                nodes: nodes || [],
                edges: edges || [],
                userId: userId,
                chatHistory: {
                    create: {
                        messages: chatMessages || [],
                    },
                },
            },
            include: {
                chatHistory: true, // Include the new chat history in the response.
            },
        });

        res.status(201).json({ status: "success", message: "Session saved successfully", data: { session: newSession } });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to save session", error: err.message });
    }
}

// --- Delete Session Controller ---
// Deletes a specific session after verifying ownership.
export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // First, find the session to ensure it exists and belongs to the user.
        const session = await prisma.treeSession.findUnique({ where: { id } });
        if (!session || session.userId !== userId) {
            return res.status(404).json({ status: "error", message: "Session not found or access denied" });
        }

        // Delete the session. The related ChatHistory will be deleted automatically due to the schema relation.
        await prisma.treeSession.delete({ where: { id } });

        res.status(200).json({ status: "success", message: "Session deleted successfully", data: null });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to delete session", error: err.message });
    }
}

// --- Get Latest Session Controller ---
// Retrieves the most recently updated session for the user.
export const getLatestSession = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the first session for the user when ordered by `updatedAt` descending.
        const session = await prisma.treeSession.findFirst({
            where: { userId },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                chatHistory: true,
            },
        });

        // If no session is found, it's not an error, just an informational status.
        if (!session) {
            return res.status(200).json({ status: "info", message: "No sessions found for this user.", data: null });
        }

        res.status(200).json({ status: "success", message: "Latest session retrieved successfully", data: { session } });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to retrieve the latest session", error: err.message });
    }
};