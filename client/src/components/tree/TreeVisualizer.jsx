import React, {useCallback, useMemo} from 'react'
import ReactFlow, {Background, Controls } from "reactflow";
import { toast } from "react-toastify";
import "reactflow/dist/style.css";

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { addEdge, setSelectedNode, applyEdgeChangesToState, applyNodeChangeToState } from '../../redux/slice/treeSlice.js';

const controlStyles = {
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: "8px",
};

// Custom styles for React Flow to match our dark theme
const proOptions = {hideAttribution: true};

const TreeVisualizer = () => {
    const dispatch = useDispatch();

    // State from Redux
    const { nodes, edges, selectedNodeId, highlightedNodeId } = useSelector((state) => state.tree);

    // Dispatch handlers
    const onNodesChange = useCallback(
        (changes) => {
            dispatch(applyNodeChangeToState(changes));
        },
        [dispatch]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            dispatch(applyEdgeChangesToState(changes));
        },
        [dispatch],
    );

    // This function validates a new connection before it's made
    const isValidConnection = useCallback(
        (connection) => {
            // Count existing outgoing edges from the source node
            const outgoingEdges = edges.filter((edge) => edge.source === connection.source).length;

            // A node cannot connect to itself
            if(connection.source === connection.target){
                return false;
            }

            // A node can have maximum of two children
            if(outgoingEdges >= 2){
                return false;
            }

            return true;
        },
        [edges],
    );



    // This runs when a user manually connects two nodes
    const onConnect = useCallback(
        (params) => {
            // Create a new edge object
            const newEdge = {...params, id: `${params.source}-${params.target}`}

            // Dispatch the addEdge action to redux
            dispatch(addEdge(newEdge));
        },
        [dispatch]
    );

    const onSelectionChange = useCallback(
        ({nodes}) => {
            // Set selectedNodeId to the first selected node, or null if none
            dispatch(setSelectedNode(nodes.length > 0 ? nodes[0].id : null))
        },
        [dispatch]
    );

    // Style nodes based on selection
    const memoizedNodes = useMemo(() => {
        return nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHighlighted = node.id === highlightedNodeId;

            let label = node.data?.label || node.label || node.id;

            const displayLabel = String(label)

            let style = {
                border: "1px solid var(--color-border-accent)",
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-bg-primary)",
                boxShadow: "none",
                transition: "all 0.3s ease",
                width: "auto",
                minWidth: 50,
                padding: "5px 10px"
            };

            if(isSelected){
                style.border = "2px solid var(--color-accent)";
                style.boxShadow = "0 0 10px var(--color-accent)";
            }

            if(isHighlighted){
                style.border = "2px solid var(--color-highlight)";
                style.backgroundColor = "var(--color-highlight)";
                style.color = "var(--color-highlight-text)";
                style.boxShadow = "0 0 15 var(--color-highlight)";
            }

            return {
                ...node,
                data: {label: displayLabel},
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
                nodes={memoizedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                onSelectionChange={onSelectionChange}
                proOptions={proOptions}
                fitView
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
