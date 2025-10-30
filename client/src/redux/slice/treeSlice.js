import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

// Find the root node
const findRootNode = (nodes, edges) => {
    const targetNodes = new Set(edges.map(edge => edge.target));
    const root = nodes.find(node => !targetNodes.has(node.id));
    return root ? root.id : (nodes.length > 0 ? nodes[0].id : null);
}

// Build an adjacency list from nodes to edges
const buildAdjacencyList = (nodes, edges) => {
    const adj = new Map();
    nodes.forEach(node => adj.set(node.id, {left: null, right: null, data: node.data.label}));

    // This is a simple login. It assumes first edge is left , second is right
    edges.forEach(edge => {
        const parent = adj.get(edge.source);

        if (parent) {
            if (!parent.left) {
                parent.left = edge.target;
            } else if (!parent.right) {
                parent.right = edge.target;
            }
        }
    });

    return adj;
};

// Traversal Algorithms
const getPreOrderPath = (nodeId, adj, path) => {
    if(!nodeId){
        return;
    }

    path.push(nodeId);
    const node = adj.get(nodeId);

    if(node){
        getPreOrderPath(node.left, adj, path);
        getPreOrderPath(node.right, adj, path);
    }
};

const getInOrderPath = (nodeId, adj, path) => {
    if(!nodeId){
        return;
    }

    const node = adj.get(nodeId);

    if(node){
        getInOrderPath(node.left, adj, path);
        path.push(nodeId);
        getInOrderPath(node.right, adj, path);
    }
};

const getPostOrderPath = (nodeId, adj, path) => {
    if (!nodeId) return;

    const node = adj.get(nodeId);

    if (node) {
        getPostOrderPath(node.left, adj, path);
        getPostOrderPath(node.right, adj, path);
        path.push(nodeId);
    }
};

// The Async Thunk for Animation
export const animateTraversal = createAsyncThunk(
    "tree/animateTraversal",
     async ({type}, {getState, dispatch}) => {
        const treeState = getState().tree;
        const {nodes, edges} = treeState;
        const adj = buildAdjacencyList(nodes, edges);
        const rootId = findRootNode(nodes, edges);

        if(!rootId){
            return
        }

        const path = [];

        if(type === "pre-order"){
            getPreOrderPath(rootId, adj, path);
        }else if(type === "in-order"){
            getInOrderPath(rootId, adj, path);
        }else if(type === "post-order"){
            getPostOrderPath(rootId, adj, path);
        }

        // Animation loop
         for(const nodeId of path){
             dispatch(setHighlightedNode(nodeId));
             await new Promise(resolve => setTimeout(resolve, 700))
         }

         dispatch(setHighlightedNode(null));
     }
);

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
    selectedNodeId: null,
    highlightedNodeId: null,
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
        setSelectedNode(state, action){
          state.selectedNodeId = action.payload;
        },
        setHighlightedNode(state, action) {
            state.highlightedNodeId = action.payload;
        },
        // Adds a single new node
        addNode(state, action){
            const newNodeId = `node_${Date.now()}`;
            const newNode = {
                id: newNodeId,
                // Position randomly for now
                position: {x: Math.random() * 300, y: Math.random() * 300},
                data: {label: `New Node`},
            }

            state.nodes.push(newNode);
        },
        deleteNode(state){
            if(!state.selectedNodeId){
                // Do nothing if no node is selected
                return;
            }

            // Remove the selected node
            state.nodes = state.nodes.filter(
                (node) => node.id !== state.selectedNodeId
            );

            // Remove all edges connected to the selected node
            state.edges = state.edges.filter(
                (edge) => edge.source !== state.selectedNodeId && edge.target !== state.selectedNodeId
            );

            state.selectedNodeId = null;
        },
        editNode(state, action){
            if(!state.selectedNodeId){
                // Do nothing if no node is selected
                return;
            }

            const newLabel = action.payload;
            state.nodes = state.nodes.map((node) =>
                node.id === state.selectedNodeId
                ? {...node, data: {...node.data, label: newLabel}}
                : node
            )
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

export const {
    setTreeState,
    addNode,
    addEdge,
    resetTree,
    setSelectedNode,
    setHighlightedNode,
    editNode,
    deleteNode,
} = treeSlice.actions;
export default treeSlice.reducer;