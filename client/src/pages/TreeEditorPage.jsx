// Importing necessary libraries and components
import React, {useState} from 'react'
import Navbar from "../components/layout/Navbar.jsx";
import LeftSidebar from "../components/layout/LeftSidebar.jsx";
import ChatPanel from "../components/chat/ChatPanel.jsx";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/outline/index.js";
import TreeVisualizer from "../components/tree/TreeVisualizer.jsx";

// TreeEditorPage component
const TreeEditorPage = () => {
    // State for chat panel visibility
    const [isChatOpen, setIsChatOpen] = useState(false);


    return (
        <div className="flex flex-col h-full w-full text-text-primary bg-bg-primary">
            {/* Navbar component */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* LeftSidebar component */}
                <LeftSidebar />

                <main className="flex-1 relative">
                    {/* TreeVisualizer component */}
                    <TreeVisualizer />
                </main>

                {/* ChatPanel component */}
                <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                {/* Button to open chat panel on smaller screens */}
                <button onClick={() => setIsChatOpen(true)} className="lg:hidden fixed bottom-6 right-6 bg-accent text-white p-4 rounded-full shadow-lg z-20 hover:bg-accent-hover transition-colors" aria-label="AI Assistant">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
export default TreeEditorPage
