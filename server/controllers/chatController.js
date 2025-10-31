// Importing necessary libraries and modules
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../lib/db.js";

// Initialize the Google Generative AI client with the API key from environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- System Prompt Definition ---
// This prompt defines the core behavior and response structure for the AI model.
const systemPrompt = `
You are an AI supervisor for a tree data structure visualization app.
Your primary role is to interpret user requests and the current state of the tree, then respond with a structured JSON object.

**You MUST respond with a JSON object following this exact structure:**
{
    "intent": "chat | analysis | operation",
    "aiResponse": "Your text-based reply to the user.",
    "newTreeState": {"nodes": [...], "edges": [...]} | null
}

**Rules for each intent:**

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

// Extracts a JSON object from the AI's text response, handling both markdown code blocks and raw JSON.
const extractJson = (text) => {
    const markdownMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (markdownMatch && markdownMatch[1]) {
        return markdownMatch[1];
    }
    const rawJsonMatch = text.match(/\{[\s\S]*\}/);
    if (rawJsonMatch && rawJsonMatch[0]) {
        return rawJsonMatch[0];
    }
    return null;
}

// --- Main Chat Handler ---
export const handleChat = async (req, res) => {
    try {
        const { message, treeState } = req.body;

        // Configure the generative model with the system prompt and JSON response type.
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: systemPrompt,
            generationConfig: { responseMimeType: "application/json" },
        });

        // Combine the user's message and current tree state into a single prompt.
        const userPrompt = `
        User Message: "${message}"
        Current Tree State: ${JSON.stringify(treeState)}
        `;

        // Generate content using the AI model.
        const result = await model.generateContent(userPrompt);
        const aiResponseText = result.response.text();

        // Extract and parse the JSON from the AI's response.
        const jsonText = extractJson(aiResponseText);
        if (!jsonText) {
            throw new Error("No valid JSON found in the AI response.");
        }
        const aiJson = JSON.parse(jsonText);

        // Send the structured response back to the client.
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
        });
    } catch (err) {
        console.error("--- CHAT CONTROLLER ERROR ---", err);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the chat request.",
            error: err.message,
        });
    }
}

// --- Chat History Export Handler ---
export const exportChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch all chat histories associated with the user's sessions.
        const chatHistories = await prisma.chatHistory.findMany({
            where: { session: { userId: userId } },
            orderBy: { session: { createdAt: "asc" } },
        });

        // Format the chat history into a single string.
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

        // Set headers for file download and send the formatted history.
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="chat_history_${userId}.txt"`);
        res.send(formattedChatHistory);
    } catch (err) {
        console.error("Error exporting chat history:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to export chat history",
            error: err.message,
        });
    }
};