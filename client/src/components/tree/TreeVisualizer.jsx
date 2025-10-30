import React, {useCallback} from 'react'
import ReactFlow, {Background, Controls, addEdge as rfAddEdge} from "reactflow";
import "reactflow/dist/style.css";

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { addEdge, setTreeState } from '../../redux/slice/treeSlice.js';

// We'll get nodes and edges from Redux later
// const initialNodes = [
//     {
//         id: "1",
//         position: {x: 250, y: 5},
//         data: {Label: "Root Node"}
//     },
// ];
// const initialEdges = [];

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
    const { nodes, edges } = useSelector((state) => state.tree);

    // Dispatch habdlers
    const onNodesChange = (changes) => {
        // Placeholder for future node updates
        // For now, We'll let the AI manage the state
    }

    const onEdgesChange = (changes) => {
        // Placeholder for future edge updates
        // For now, We'll let the AI manage the state
    }

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

    return (
        <div style={{height: "100%", width: "100%"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
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
