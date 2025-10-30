import React, {useState} from 'react'
import Navbar from "../components/layout/Navbar.jsx";
import LeftSidebar from "../components/layout/LeftSidebar.jsx";
import TreeVisualizer from "../components/tree/TreeVisualizer.jsx";
import ChatPanel from "../components/chat/ChatPanel.jsx";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/outline/index.js";

const TreeEditorPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);


    return (
        <div className="flex flex-col h-full w-full text-light bg-dark-900">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar />

                <main className="flex-1 relative">
                    <TreeVisualizer />
                </main>

                <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                <button onClick={() => setIsChatOpen(true)} className="lg:hidden fixed bottom-6 right-6 bg-accent text-white p-4 rounded-full shadow-lg z-20 hover:bg-accent-hover transition-colors" aria-label="AI Assistant">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
export default TreeEditorPage
