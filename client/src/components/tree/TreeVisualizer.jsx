// Importing necessary libraries and components
import React, {useCallback, useMemo} from 'react'
import ReactFlow, {Background, Controls, addEdge as rfAddEdge} from "reactflow";
import "reactflow/dist/style.css";

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedNode, applyEdgeChangesToState, applyNodeChangeToState } from '../../redux/slice/treeSlice.js';

// Custom styles for the React Flow controls to match the application's theme.
const controlStyles = {
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: "8px",
};

// Hides the "Pro" attribution from React Flow.
const proOptions = {hideAttribution: true};

// The main component for visualizing and interacting with the tree structure.
const TreeVisualizer = () => {
    const dispatch = useDispatch();

    // --- Redux State ---
    const { nodes, edges, selectedNodeId, highlightedNodeId } = useSelector((state) => state.tree);

    // --- React Flow Event Handlers ---

    // Handles changes to nodes (e.g., dragging) and dispatches them to Redux.
    const onNodesChange = useCallback(
        (changes) => {
            dispatch(applyNodeChangeToState(changes));
        },
        [dispatch]
    );

    // Handles changes to edges and dispatches them to Redux.
    const onEdgesChange = useCallback(
        (changes) => {
            dispatch(applyEdgeChangesToState(changes));
        },
        [dispatch],
    );

    // Handles the creation of a new edge by user interaction.
    const onConnect = useCallback(
        (params) => {
            const newEdge = {...params, id: `${params.source}-${params.target}`};
            // Note: This is a placeholder. A proper addEdge reducer is needed in treeSlice.
            // dispatch(addEdge(newEdge));
            console.warn("onConnect is not fully implemented in Redux slice.");
        },
        [dispatch]
    );

    // Updates the selected node ID in Redux state when the user clicks a node.
    const onSelectionChange = useCallback(
        ({nodes}) => {
            dispatch(setSelectedNode(nodes.length > 0 ? nodes[0].id : null));
        },
        [dispatch]
    );

    // --- Node Styling Logic ---

    // Memoizes the nodes array to apply dynamic styles for selection and highlighting.
    const memoizedNodes = useMemo(() => {
        return nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHighlighted = node.id === highlightedNodeId;

            let style = {
                border: "1px solid var(--color-border-accent)",
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-bg-primary)",
                boxShadow: "none",
                transition: "all 0.3s ease"
            };

            if(isSelected){
                style.border = "2px solid var(--color-accent)";
                style.boxShadow = "0 0 10px var(--color-accent)";
            }

            if(isHighlighted){
                style.border = "2px solid var(--color-highlight)";
                style.backgroundColor = "var(--color-highlight)";
                style.color = "var(--color-highlight-text)";
                style.boxShadow = "0 0 15px var(--color-highlight)";
            }

            return {
                ...node,
                style: {
                    ...node.style,
                    ...style,
                },
            };
        });
    }, [nodes, selectedNodeId, highlightedNodeId]);

    return (
        <div style={{height: "100%", width: "100%"}}>
            <ReactFlow
                nodes={memoizedNodes} // Use the memoized nodes with dynamic styles
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                proOptions={proOptions}
                fitView // Automatically fits the view to the nodes
            >
                <Background
                    variant="dots"
                    gap={16}
                    size={1}
                    className="bg-bg-primary"
                    color="#374151"
                />
                <Controls
                    style={controlStyles}
                    buttonClassName="[&>svg]:fill-[var(--color-text-secondary)] hover:!bg-[var(--color-bg-primary)]"
                />
            </ReactFlow>
        </div>
    )
}
export default TreeVisualizer