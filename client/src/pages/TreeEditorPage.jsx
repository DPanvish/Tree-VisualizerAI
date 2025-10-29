import React from 'react'
import Navbar from "../components/layout/Navbar.jsx";
import LeftSidebar from "../components/layout/LeftSidebar.jsx";
import TreeVisualizer from "../components/tree/TreeVisualizer.jsx";
import ChatPanel from "../components/chat/ChatPanel.jsx";

const TreeEditorPage = () => {
    return (
        <div className="flex flex-col h-screen w-full text-light bg-dark-900">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar />

                <main className="flex-1 flex flex-col h-full overflow-hidden">
                    <TreeVisualizer />
                </main>

                <ChatPanel />
            </div>
        </div>
    )
}
export default TreeEditorPage
