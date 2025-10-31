import React, { useRef, useState, useEffect } from 'react'
import {ArrowDownOnSquareIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon} from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import { toast } from "react-toastify";
import AIAvatar from "../../assets/ai-avatar.png";
import User from "../../assets/User.png"

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, clearMessages } from "../../redux/slice/chatSlice.js";
import { setTreeState } from "../../redux/slice/treeSlice.js";

const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
};

const ChatPanel = ({isOpen, onClose}) => {
    const dispatch = useDispatch();

    // State from Redux
    const {messages} = useSelector((state) => state.chat);
    const {nodes, edges} = useSelector((state) => state.tree);
    const {token} = useSelector((state) => state.auth);

    // Local state for the input field and loading indicator
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Ref to the end of the message list for auto-scrolling
    const messageEndRef = useRef(null);
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    // Effect to auto-scroll whenever a new message is added to the list
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    

    // Dispatch handlers
    const handleSend = async() => {
        setIsLoading(true);
        try{
            // Prevent sending empty messages
            if(input.trim() === ""){
                return;
            }

            // Create a new message object for the user's input
            const userMessage = {
                id: `user_${Date.now()}`,
                role: "user",
                content: input.trim(),
                timestamp: new Date().toISOString(),
            };

            // Optimistically update the UI by dispatching the user's message immediately
            dispatch(addMessage(userMessage));
            setInput("");

            // Prepare the request body for the API call
            const body = {
                message: userMessage.content,
                treeState: {nodes, edges},
            }

            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            // Make the API call to the chat endpoint
            const response = await axios.post("http://16.16.211.73:5000/api/chat", body, config);

            // On a successful response, process the AI's message and any tree updates
            if(response.data.status === "success"){
                const {aiMessage, newTreeState} = response.data.data;

                dispatch(addMessage(aiMessage));

                // If the AI provided a new tree state, update the visualizer
                if(newTreeState){
                    dispatch(setTreeState(newTreeState));
                }
            }
        }catch(err){
            const message = err.response?.data?.message || "Chat request failed";
            toast.error(message);
        } finally {
            // Always ensure the loading state is turned off after the request completes
            setIsLoading(false);
        }
    }

    /**
     * Handles the logic for exporting the user's entire chat history.
     * It fetches the data from the server and triggers a file download in the browser.
     */
    const handleExportChat = async() => {
        try{
            const config = {
                headers: {Authorization: `Bearer ${token}`},
            };

            const response = await axios.get("http://16.16.211.73:5000/api/chat/export", config);

            // Create a Blob from the plain text response data
            const blob = new Blob([response.data], {type: "text/plain"});

            // Create a temporary link element to trigger the browser's download functionality
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            link.download = `chat_export_${timestamp}.txt`;

            // Append to the DOM, click it, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the created object URL to free up memory
            URL.revokeObjectURL(link.href);

            toast.success("Chat exported successfully!");
        }catch(err){
            const message = err.response?.data?.message || "Chat export failed";
            toast.error(message);
        }
    }

    /**
     * Handles clearing the current chat session's messages after user confirmation.
     */
    const handleClearChat = () => {
        if(window.confirm("Are you sure you want to clear the current chat? This action cannot be undone.")){
            dispatch(clearMessages());
            toast.info("Chat cleared successfully!");
        }
    }

    return (
        <>
            {/* Mobile Overlay: Dims the background when the drawer is open on smaller screens */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Main Chat Panel Container: Functions as a drawer on mobile and a static sidebar on desktop */}
            <aside className={`fixed top-0 right-0 h-full w-80 bg-bg-secondary flex flex-col z-40 transform transition-transform ease-in-out duration-300
            lg:relative lg:translate-x-0 lg:z-auto lg:border-l lg:border-border-accent ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Chat Header */}
                <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-border-accent gap-4">
                    <h2 className="font-semibold text-text-primary text-lg">AI Assistant</h2>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleExportChat}
                            type="button"
                            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                            title="Export Chat History"
                        >
                            <ArrowDownOnSquareIcon className="w-6 h-6" />
                        </button>

                        <button
                            onClick={handleClearChat}
                            type="button"
                            className="text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                            title="Clear Chat History"
                        >
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Close button for mobile view */}
                    <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden transition-colors cursor-pointer">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Message List: A scrollable container for all chat messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.role === "ai" ? (
                                // AI Message Layout
                                <div className="flex items-start space-x-3">
                                    <img src={AIAvatar} alt="AI Assistant" className="w-8 h-8 rounded-full border-2 border-border-accent" />

                                    <div className="flex flex-col items-start">
                                        <div className="p-3 rounded-lg max-w-xs shadow bg-bg-primary text-text-primary">
                                            <p className="text-sm break-words">{message.content}</p>
                                        </div>

                                        <span className="text-sm text-text-secondary mt-1 px-2">
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                // User Message Layout
                                <div className="flex items-start justify-end space-x-3">


                                    <div className="flex flex-col items-end">
                                        <div className="p-3 rounded-lg max-w-xs shadow bg-accent text-white">
                                            <p className="text-sm break-words">{message.content}</p>
                                        </div>

                                        <span className="text-sm text-text-secondary mt-1 px-2">
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                    </div>

                                    <img src={User} alt="User" className="w-8 h-8 rounded-full border-2 border-border-accent" />
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Typing Indicator: Displays while waiting for the AI's response */}
                    {isLoading && (
                        <div className="flex items-start space-x-3">
                            <img src={AIAvatar} alt="AI Assistant" className="w-8 h-8 rounded-full border-2 border-border-accent" />
                            <div className="p-3 rounded-lg max-w-xs shadow bg-bg-primary text-text-primary">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Empty div used as a reference point for auto-scrolling to the bottom */}
                    <div ref={messageEndRef} />
                </div>

                {/* Chat Input Form */}
                <div className="p-4 border-t border-border-accent shrink-0">
                    <form className="flex space-x-2" onSubmit={(e) => {e.preventDefault(); handleSend()}}>
                        <input
                            type="text"
                            placeholder="Type a command..."
                            className="bg-bg-primary text-text-primary p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent"
                            disabled={isLoading}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                            disabled={isLoading}
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
export default ChatPanel
