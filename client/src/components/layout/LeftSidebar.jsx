import React from 'react'
import {
    ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon,
    LinkIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline/index.js";
import {useTheme} from "../../context/ThemeContext.jsx";

// Redux Imports
import { useDispatch } from "react-redux";
import { resetTree } from "../../redux/slice/treeSlice.js"

// A reusable button component for the sidebar
const SidebarButton = ({icon: Icon, label}) => (
    <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-light hover:bg-dark-900 transition-colors">
        <Icon className="w-5 h-5 text-muted" />
        <span className="text-sm font-medium">{label}</span>
    </button>
)

const LeftSidebar = () => {
    const {isSidebarOpen} = useTheme();
    const dispatch = useDispatch();

    // Dispatch Handler
    const handleResetTree = () => {
        dispatch(resetTree());
    }

    return (
        <aside
            className={`
                w-64 bg-dark-800 p-4 flex flex-col space-y-6 border-r border-dark-700 overflow-y-auto
                absolute top-16 bottom-0 md:static md:top-auto md:bottom-auto md:h-full z-10 
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
      `}
        >
            {/* Section 1: Controls */}
            <div>
                <h3 className="px-2 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Controls
                </h3>

                <div className="flex flex-col space-y-1">
                    <SidebarButton icon={PlusIcon} label="Add Node" />
                    <SidebarButton icon={TrashIcon} label="Delete Node" />
                    <SidebarButton icon={PencilSquareIcon} label="Edit Node" />
                    <SidebarButton icon={LinkIcon} label="Connect Nodes" />
                </div>
            </div>

            {/* Section 2: Traversal Animations */}
            <div>
                <h3 className="px-2 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Traversal Animations
                </h3>
                <div className="flex flex-col space-y-1">
                    <SidebarButton icon={ArrowDownRightIcon} label="Pre-order Traversal" />
                    <SidebarButton icon={ArrowRightIcon} label="In-order Traversal" />
                    <SidebarButton icon={ArrowUpRightIcon} label="Post-order Traversal" />
                </div>
            </div>

            {/* Reset Button at the bottom */}
            <div className="mt-auto pt-4">
                <button
                    onClick={handleResetTree}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    Reset Tree
                </button>
            </div>
        </aside>
    )
}
export default LeftSidebar
