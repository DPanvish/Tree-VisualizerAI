import {createSlice} from "@reduxjs/toolkit";


const initialNodes = [
    {
        id: "1",
        position: {x: 250, y: 5},
        data: {Label: "Root Node"},
        type: "default",
    },
];

const initialState = {
    nodes: initialNodes,
    edges: [],
};

const treeSlice = createSlice({
    name: "tree",
    initialState,
    reducers: {
        // Replaces the entire
        setTreeState(state, action){
            const {nodes, edges} = action.payload;
            state.nodes = nodes;
            state.edges = edges;
        },
        // Adds a single new node
        addNode(state, action){
            // action.payload should be a new node object
            state.nodes.push(action.payload);
        },
        // Adds a single new edge
        addEdge(state, action){
            // action.payload should be a new edge object
            state.edges.push(action.payload);
        },
        // Resets the tree to its initial state
        resetTree(state){
            state.nodes = initialNodes;
            state.edges = [];
        },
    },
});

export const {setTreeState, addNode, addEdge, resetTree} = treeSlice.actions;
export default treeSlice.reducer;