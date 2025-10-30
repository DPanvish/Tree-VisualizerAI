import React, {useState} from 'react'
import {PaperAirplaneIcon, XMarkIcon} from "@heroicons/react/24/outline/index.js";

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from "../../redux/slice/chatSlice.js";

const ChatPanel = ({isOpen, onClose}) => {
    const dispatch = useDispatch();

    // State from Redux
    const { messages } = useSelector((state) => state.chat);

    const [input, setInput] = useState("");

    // Dispatch handlers
    const handleSend = () => {
        if(input.trim() === ""){
            return;
        }

        // Create new message object
        const userMessage = {
            id: Date.now(),
            role: "user",
            content: input.trim(),
        };

        // Dispatch the user's message to the Redux store
        dispatch(addMessage(userMessage));

        // Later we'll add API calls

        setInput("");
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>


            <aside className={`fixed top-0 right-0 h-full w-80 bg-dark-800 flex flex-col z-40 transform transition-transform ease-in-out duration-300
            lg:relative lg:translate-x-0 lg:z-auto lg:border-l lg:border-dark-700 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Chat Header */}
                <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-dark-700">
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
                                        : "bg-dark-900 text-light"
                                }`}
                            >
                                <p className="text-sm">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-dark-700 shrink-0">
                    <form className="flex space-x-2" onSubmit={(e) => {e.preventDefault(); handleSend()}}>
                        <input
                            type="text"
                            placeholder="Type a command..."
                            className="bg-dark-700 text-white p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />

                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white p-2 rounded-lg transition-colors flex-shrink-0"
                            onClick={handleSend}
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
