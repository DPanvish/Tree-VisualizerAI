import React from 'react'
import ReactFlow, {Background, Controls} from "reactflow";

// We'll get nodes and edges from Redux later
const initialNodes = [
    {
        id: "1",
        position: {x: 250, y: 5},
        data: {Label: "Root Node"}
    },
];
const initialEdges = [];

// Custom styles for React Flow to match our dark theme
const proOptions = {hideAttribution: true};

const TreeVisualizer = () => {
    return (
        <div style={{height: "100%", width: "100%"}}>
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                proOptions={proOptions}
                fitView
            >
                <Background
                    variant="dots"
                    gap={16}
                    size={1}
                    color="#374151"
                />

                <Controls
                    style={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                    }}
                    buttonClassName="[&>svg]:fill-text-muted hover:!bg-dark-900"
                />
            </ReactFlow>
        </div>
    )
}
export default TreeVisualizer
