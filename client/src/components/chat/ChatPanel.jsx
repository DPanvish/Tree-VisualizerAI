import React, { useRef, useState, useEffect } from 'react'
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline/index.js";
import axios from "axios";
import { toast } from "react-toastify";

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from "../../redux/slice/chatSlice.js";
import { setTreeState } from "../../redux/slice/treeSlice.js";

const ChatPanel = ({isOpen, onClose}) => {
    const dispatch = useDispatch();

    // State from Redux
    const {messages} = useSelector((state) => state.chat);
    const {nodes, edges} = useSelector((state) => state.tree);
    const {token} = useSelector((state) => state.auth);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto scroll to bottom
    const messageEndRef = useRef(null);
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    

    // Dispatch handlers
    const handleSend = async() => {
        if(input.trim() === ""){
            return;
        }

        // Create new message object
        const userMessage = {
            id: `user_${Date.now()}`,
            role: "user",
            content: input.trim(),
        };

        // Dispatch the user's message to the Redux store
        dispatch(addMessage(userMessage));
        setInput("");

        try{
            const body = {
                message: userMessage.content,
                treeState: {nodes, edges},
            }

            const config = {
                headers: {Authorization: `Bearer ${token}`}
            };

            const response = await axios.post("http://localhost:5000/api/chat", body, config);

            if(response.data.status === "success"){
                const {aiMessage, newTreeState} = response.data.data;

                dispatch(addMessage(aiMessage));

                if(newTreeState){
                    dispatch(setTreeState(newTreeState));
                }
            }
        }catch(err){
            const message = err.response?.data?.message || "Chat request failed";
            toast.error(message);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>


            <aside className={`fixed top-0 right-0 h-full w-80 bg-bg-secondary flex flex-col z-40 transform transition-transform ease-in-out duration-300
            lg:relative lg:translate-x-0 lg:z-auto lg:border-l lg:border-border-accent ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Chat Header */}
                <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-border-accent">
                    <h2 className="font-semibold text-light text-lg">AI Assistant</h2>

                    {/* Close button for moblie */}
                    <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Messages */}
                {/*<div className="flex-1 p-4 space-y-4 overflow-y-auto">*/}
                {/*    /!* Example AI message *!/*/}
                {/*    <div className="flex">*/}
                {/*        <div className="bg-dark-900 p-3 rounded-lg max-w-xs shadow">*/}
                {/*            <p className="text-sm text-light">*/}
                {/*                Hello! How can I help you build your tree? Try 'create a binary*/}
                {/*                search tree with nodes 5, 3, 8'.*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    /!* Example User message *!/*/}
                {/*    <div className="flex justify-end">*/}
                {/*        <div className="bg-dark-700 p-3 rounded-lg max-w-xs shadow">*/}
                {/*            <p className="text-sm text-white">*/}
                {/*                Create a BST with nodes 5, 3, 8*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-xs shadow ${
                                    message.role === "user"
                                        ? "bg-accent text-white"
                                        : "bg-bg-primary text-text-primary"
                                }`}
                            >
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-border-accent shrink-0">
                    <form className="flex space-x-2" onSubmit={(e) => {e.preventDefault(); handleSend()}}>
                        <input
                            type="text"
                            placeholder="Type a command..."
                            className="bg-bg-primary text-text-primary p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent"
                            disabled={isLoading}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />

                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white p-2 rounded-lg transition-colors flex-shrink-0"
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
