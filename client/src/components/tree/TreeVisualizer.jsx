import React, {useCallback, useMemo} from 'react'
import ReactFlow, {Background, Controls, addEdge as rfAddEdge} from "reactflow";
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

            let style = {
                border: "1px solid var(--color-dark-700)",
                boxShadow: "none",
                transition: "all 0.3s eas,e"
            };

            if(isSelected){
                style.border = "2px solid var(--color-accent)";
                style.boxShadow = "0 0 10px var(--color-accent)";
            }

            if(isHighlighted){
                style.border = "2px solid var(--color-highlight)";
                style.backgroundColor = "var(--color-highlight)";
                style.color = "#FFFFFF";
                style.boxShadow = "0 0 15 var(--color-highlight)";
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
                nodes={memoizedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                proOptions={proOptions}
                fitView
            >
                <Background
                    variant="dots"
                    gap={16}
                    size={1}
                    className="bg-dark-900"
                    color="#374151"
                />

                <Controls
                    style={controlStyles}
                    buttonClassName="[&>svg]:fill-text-muted hover:!bg-dark-900"
                />
            </ReactFlow>
        </div>
    )
}
export default TreeVisualizer
