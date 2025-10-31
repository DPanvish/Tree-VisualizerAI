import prisma from "../lib/db.js";

// Get a list of all saved tree sessions for the logged-in user
export const getAllSessions = async (req, res) => {
    try{
        const userId = req.user.userId;

        const sessions = await prisma.treeSession.findMany({
            where: {userId},
            select: {
                id: true,
                name: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: "desc",
            }
        });

        res.status(200).json({status: "success", message: "Sessions retrieved successfully", data: {sessions}});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to retrieve sessions", error: err.message});
    }
}

// Get a single specific tree session (nodes, edges, and chat)
export const getSessionById = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.userId;

        const session = await prisma.treeSession.findUnique({
            where: {id},
            include: {
                chatHistory: true,
            },
        });

        if(!session || session.userId !== userId){
            return res.status(404).json({status: "error", message: "Session not found or not owned by the user"});
        }

        res.status(200).json({status: "success", message: "Session retrieved successfully", data: {session}});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to retrieve session", error: err.message});
    }
}

// Save a new tree session (and it's chat)
export const saveNewSession = async (req, res) => {
    try{
        const {name, nodes, edges, chatMessages} = req.body;
        const userId = req.user.userId;

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
                chatHistory: true,
            },
        });

        res.status(201).json({status: "success", message: "Session saved successfully", data: {newSession}});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to save session", error: err.message});
    }
}

// Delete a specific tree session
export const deleteSession = async(req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.userId;

        const session = await prisma.treeSession.findUnique({
            where: {id},
        })

        if(!session || session.userId !== userId){
            return res.status(404).json({status: "error", message: "Session not found or not owned by the user"});
        }

        await prisma.treeSession.delete({
            where: {id},
        });

        res.status(200).json({status: "success", message: "Session deleted successfully", data: null});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to delete session", error: err.message});
    }
}


// get the latest session
export const getLatestSession = async(req, res) => {
    try{
        const userId = req.user.userId;

        const latestSession = await prisma.treeSession.findFirst({
            where: {userId},
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                chatHistory: true,
            },
        });

        if(!latestSession){
            return res.status(200).json({status: "info", message: "No sessions found", data: null});
        }

        res.status(200).json({status: "success", message: "Latest session retrieved successfully", data: {latestSession}});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to retrieve latest session", error: err.message});
    }
}