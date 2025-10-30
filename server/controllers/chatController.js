
export const handleChat = async(req,res) => {
    try{
        const {message, treeState} = req.body;
        const userId = req.user.userId;

        // Incoming message data
        console.log(`Received message: "${message}" from user ${userId}`);
        console.log("Current Tree State:", treeState);

        // AI Logic

        // Send a mock response
        const mockAiResponse = {
            role: "ai",
            id: `ai_${Date.now()}`,
            content: `You said: "${message}"`
        }

        res.status(200).json({status: "success",  message: "Chat message processed", data: {aiMessage: mockAiResponse, newTreeState: null}});
    }catch(err){
        res.status(500).json({status: "error", message: "Chat processing failed", error: err.message});
    }
}