import React from 'react'
import {PaperAirplaneIcon} from "@heroicons/react/24/outline/index.js";

const ChatPanel = () => {
    return (
        <aside className="w-80 h-full bg-dark-800 border-l border-dark-700 flex-col
      hidden md:flex">
            {/* Chat Header */}
            <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-dark-700">
                <h2 className="font-semibold text-light text-lg">AI Assistant</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Example AI message */}
                <div className="flex">
                    <div className="bg-dark-900 p-3 rounded-lg max-w-xs shadow">
                        <p className="text-sm text-light">
                            Hello! How can I help you build your tree? Try 'create a binary
                            search tree with nodes 5, 3, 8'.
                        </p>
                    </div>
                </div>

                {/* Example User message */}
                <div className="flex justify-end">
                    <div className="bg-dark-700 p-3 rounded-lg max-w-xs shadow">
                        <p className="text-sm text-white">
                            Create a BST with nodes 5, 3, 8
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-dark-700 shrink-0">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Type a command..."
                        className="bg-accent hover:bg-accent-hover text-white p-2 rounded-lg transition-colors flex-shrink-0"
                    />

                    <button className="bg-accent hover:bg-accent-hover text-white p-2 rounded-lg transition-colors flex-shrink-0">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
export default ChatPanel
