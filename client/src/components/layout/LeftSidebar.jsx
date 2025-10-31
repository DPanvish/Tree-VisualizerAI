// Importing necessary libraries and components
import React from 'react';
import {
    ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline/index.js";
import { useTheme } from "../../context/ThemeContext.jsx";

// Redux Imports
import { useDispatch } from "react-redux";
import { deleteNode, editNode, resetTree, animateTraversal } from "../../redux/slice/treeSlice.js";

// A reusable button component for the sidebar to ensure a consistent look and feel.
const SidebarButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-3 w-full p-2 rounded-lg text-text-primary hover:bg-bg-primary transition-colors"
    >
        <Icon className="w-5 h-5 text-text-secondary" />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

// The sidebar component containing controls for tree manipulation and traversal animations.
const LeftSidebar = () => {
    const { isSidebarOpen } = useTheme();
    const dispatch = useDispatch();

    // --- Event Handlers for Tree Manipulation ---

    // Note: addNode is not used here as it's handled by the AI. This is a placeholder.
    // const handleAddNode = () => dispatch(addNode());

    const handleDeleteNode = () => {
        if (window.confirm("Are you sure you want to delete the selected node?")) {
            dispatch(deleteNode());
        }
    };

    const handleEditNode = () => {
        const newLabel = prompt("Enter a new label for the selected node:");
        if (newLabel !== null && newLabel.trim() !== "") {
            dispatch(editNode(newLabel));
        }
    };

    const handleResetTree = () => {
        if (window.confirm("Are you sure you want to reset the entire tree?")) {
            dispatch(resetTree());
        }
    };

    // --- Event Handlers for Traversal Animations ---

    const handlePreOrder = () => dispatch(animateTraversal({ type: "pre-order" }));
    const handleInOrder = () => dispatch(animateTraversal({ type: "in-order" }));
    const handlePostOrder = () => dispatch(animateTraversal({ type: "post-order" }));

    return (
        <aside
            className={`
                w-64 bg-bg-secondary p-4 flex flex-col space-y-6 border-r border-border-accent overflow-y-auto
                absolute top-16 bottom-0 md:static md:h-auto z-20 
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}
        >
            {/* Tree Controls Section */}
            <div>
                <h3 className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Controls</h3>
                <div className="flex flex-col space-y-1">
                    {/* <SidebarButton icon={PlusIcon} label="Add Node" onClick={handleAddNode} /> */}
                    <SidebarButton icon={PencilSquareIcon} label="Edit Node Label" onClick={handleEditNode} />
                    <SidebarButton icon={TrashIcon} label="Delete Selected Node" onClick={handleDeleteNode} />
                </div>
            </div>

            {/* Traversal Animations Section */}
            <div>
                <h3 className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Traversal Animations</h3>
                <div className="flex flex-col space-y-1">
                    <SidebarButton icon={ArrowDownRightIcon} label="Pre-order Traversal" onClick={handlePreOrder} />
                    <SidebarButton icon={ArrowRightIcon} label="In-order Traversal" onClick={handleInOrder} />
                    <SidebarButton icon={ArrowUpRightIcon} label="Post-order Traversal" onClick={handlePostOrder} />
                </div>
            </div>

            {/* Reset Button Section */}
            <div className="mt-auto pt-4 border-t border-border-accent">
                <button
                    onClick={handleResetTree}
                    className="w-full bg-red-600/80 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    Reset Tree
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;