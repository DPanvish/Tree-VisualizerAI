import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../lib/db.js";

// Initialize the AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt
// This is the "brain" of the AI, it decides what it will do based on the input
const systemPrompt = `
You are an AI supervisor for a tree data structure visualization app.
Your job is to analyze the user's message and the current tree state.
You MUST respond with a JSON object with this exact structure:
{
    "intent": "chat | analysis | operation",
    "aiResponse": "Your text reply to the user.",
    "newTreeState": {"nodes": [...], "edges": [...]} | null,
}

Here are the rules for each intent:

1. **intent: "chat"**
   * Use this if the user is just making small talk (e.g., "Hello", "How are you?", "What's up?").
   * "aiResponse": A friendly, conversational reply.
   * "newTreeState": MUST be null.

2. **intent: "analysis"**
   * Use this if the user is ASKING a question about the tree (e.g., "What's the height?", "List all leaf nodes.", "Is this a binary search tree?").
   * "aiResponse": The text-based answer to their question.
   * "newTreeState": MUST be null.
   
3. **intent: "operation"**
   * Use this if the user is GIVING a command to change the tree (e.g., "Add node 10", "Delete node 5", "Connect 3 to 7", "Create a BST with 5, 3, 8").
   * "aiResponse": A short confirmation message. (e.g., "Okay, I've added node 10.).
   * "newTreeState": You MUST calculate the new nodes and edges arrays based on the user's command and then return the complete new state.
`;

const extractJson = (text) => {
    // First, try to find a markdown code block
    const markdownMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (markdownMatch && markdownMatch[1]) {
        // If found, return the content *inside* the block
        return markdownMatch[1];
    }

    // If no markdown block, try to find a raw JSON object
    // (in case the AI behaves correctly)
    const rawJsonMatch = text.match(/\{[\s\S]*\}/);
    if (rawJsonMatch && rawJsonMatch[0]) {
        return rawJsonMatch[0];
    }

    // If no JSON is found at all
    return null;
}

export const handleChat = async(req,res) => {
    try{
        const {message, treeState} = req.body;
        const userId = req.user.userId;

        // AI Logic
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-preview-09-2025",
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        // We send the user's message and their current tree state
        const userPrompt = `
        User Message: "${message}"
        
        Current Tree State: ${JSON.stringify(treeState)}
        `;

        // Call the AI
        const result = await model.generateContent(userPrompt);
        const aiResponseText = result.response.text();

        console.log("--- RAW AI RESPONSE ---");
        console.log(aiResponseText);
        console.log("-----------------------");

        const jsonText = extractJson(aiResponseText);

        if(!jsonText){
            throw new Error("No JSON found in the AI response");
        }

        // Parse the JSON response
        const aiJson = JSON.parse(jsonText);

        res.status(200).json({
            status: "success",
            message: "Chat processed successfully",
            data: {
                aiMessage: {
                    id: `ai_${Date.now()}`,
                    role: "ai",
                    content: aiJson.aiResponse,
                    timestamp: new Date().toISOString(),
                },
                newTreeState: aiJson.newTreeState,
            }
        })
    }catch(err){
        console.error("--- CHAT CONTROLLER CRASH ---:", err);
        res.status(500).json({
            status: "error",
            message: "Chat processing failed",
            error: err.message,
        })
    }
}

// Export the Chat function
export const exportChatHistory = async(req, res) => {
    try{
        const userId = req.user.userId;

        // Find all chat histories linked to the sessions owned by the user
        const chatHistories = await prisma.chatHistory.findMany({
            where: {
                session: {
                    userId: userId,
                },
            },
            orderBy: {
                session: {
                    createdAt: "asc",
                },
            },
        });

        let formattedChatHistory = "Chat History\n=====================\n\n";

        chatHistories.forEach((history) => {
            const messages = history.messages || [];

            messages.forEach(message => {
                const timestamp = new Date(message.timestamp).toLocaleString();
                const role = message.role === "user" ? "User" : "AI";
                formattedChatHistory += `[${timestamp}] ${role}: \n${message.content}\n\n`;
            });
            formattedChatHistory += "--- End of Session ---\n\n";
        });

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="chat_history_${userId}.txt"`);
        res.send(formattedChatHistory);
    }catch(err){
        console.error("Error exporting chat history:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to export chat history",
            error: err.message,
        });
    }
}