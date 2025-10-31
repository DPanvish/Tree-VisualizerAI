// Importing necessary libraries and components
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";

// --- Helper Functions for Tree Operations ---

// Finds the root node of the tree (a node that is never a target of an edge).
const findRootNode = (nodes, edges) => {
    const targetNodes = new Set(edges.map(edge => edge.target));
    const root = nodes.find(node => !targetNodes.has(node.id));
    // Fallback to the first node if no clear root is found.
    return root ? root.id : (nodes.length > 0 ? nodes[0].id : null);
}

// Builds an adjacency list representation of the tree for easier traversal.
const buildAdjacencyList = (nodes, edges) => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const adj = new Map();
    nodes.forEach(node => adj.set(node.id, {left: null, right: null, data: node.data.label}));

    // Group all children for each parent node.
    const childrenMap = new Map();
    edges.forEach(({source, target}) => {
        if(!childrenMap.has(source)){
            childrenMap.set(source, []);
        }
        childrenMap.get(source).push(target);
    });

    // Determine left and right children based on their x-position.
    childrenMap.forEach((children, parentId) => {
        if(children.length > 0){
            const parentNode = nodeMap.get(parentId);
            if(parentNode){
                // Sort children by x-position to distinguish left and right.
                children.sort((a, b) => (nodeMap.get(a)?.position.x || 0) - (nodeMap.get(b)?.position.x || 0));
                const parentInAdj = adj.get(parentId);
                if (parentInAdj) {
                    parentInAdj.left = children[0] || null;
                    parentInAdj.right = children[1] || null;
                }
            }
        }
    })

    return adj;
};

// --- Traversal Algorithms ---

// Recursively builds the pre-order traversal path.
const getPreOrderPath = (nodeId, adj, path) => {
    if(!nodeId) return;
    path.push(nodeId);
    const node = adj.get(nodeId);
    if(node){
        getPreOrderPath(node.left, adj, path);
        getPreOrderPath(node.right, adj, path);
    }
};

// Recursively builds the in-order traversal path.
const getInOrderPath = (nodeId, adj, path) => {
    if(!nodeId) return;
    const node = adj.get(nodeId);
    if(node){
        getInOrderPath(node.left, adj, path);
        path.push(nodeId);
        getInOrderPath(node.right, adj, path);
    }
};

// Recursively builds the post-order traversal path.
const getPostOrderPath = (nodeId, adj, path) => {
    if (!nodeId) return;
    const node = adj.get(nodeId);
    if (node) {
        getPostOrderPath(node.left, adj, path);
        getPostOrderPath(node.right, adj, path);
        path.push(nodeId);
    }
};

// --- Async Thunk for Traversal Animation ---

export const animateTraversal = createAsyncThunk(
    "tree/animateTraversal",
     async ({type}, {getState, dispatch}) => {
        const treeState = getState().tree;
        const {nodes, edges} = treeState;
        const adj = buildAdjacencyList(nodes, edges);
        const rootId = findRootNode(nodes, edges);

        if(!rootId) return;

        const path = [];
        // Select the traversal algorithm based on the type.
        if(type === "pre-order") getPreOrderPath(rootId, adj, path);
        else if(type === "in-order") getInOrderPath(rootId, adj, path);
        else if(type === "post-order") getPostOrderPath(rootId, adj, path);

        // Animate the traversal by highlighting each node in the path.
         for(const nodeId of path){
             dispatch(setHighlightedNode(nodeId));
             // Wait for a short period to visualize the highlight.
             await new Promise(resolve => setTimeout(resolve, 700));
         }

         // Clear the highlight after the animation is complete.
         dispatch(setHighlightedNode(null));
     }
);

// --- Initial State and Slice Definition ---

const initialNodes = [
    {
        id: "1",
        position: {x: 250, y: 5},
        data: {label: "Root"},
        type: "default",
    },
];

const initialState = {
    nodes: initialNodes,
    edges: [],
    selectedNodeId: null,
    highlightedNodeId: null, // ID of the node currently highlighted during animation
};

const treeSlice = createSlice({
    name: "tree",
    initialState,
    reducers: {
        // Applies node changes from React Flow to the state.
        applyNodeChangeToState(state, action){
            state.nodes = applyNodeChanges(action.payload, state.nodes);
        },
        // Applies edge changes from React Flow to the state.
        applyEdgeChangesToState(state, action){
            state.edges = applyEdgeChanges(action.payload, state.edges)
        },
        // Replaces the entire tree state (nodes and edges).
        setTreeState(state, action){
            const {nodes, edges} = action.payload;
            state.nodes = nodes;
            state.edges = edges;
        },
        // Sets the currently selected node.
        setSelectedNode(state, action){
          state.selectedNodeId = action.payload;
        },
        // Sets the node to be highlighted during animation.
        setHighlightedNode(state, action) {
            state.highlightedNodeId = action.payload;
        },
        // Deletes the currently selected node and its connected edges.
        deleteNode(state){
            if(!state.selectedNodeId) return;

            state.nodes = state.nodes.filter(node => node.id !== state.selectedNodeId);
            state.edges = state.edges.filter(edge => edge.source !== state.selectedNodeId && edge.target !== state.selectedNodeId);
            state.selectedNodeId = null;
        },
        // Edits the label of the currently selected node.
        editNode(state, action){
            if(!state.selectedNodeId) return;
            const newLabel = action.payload;
            state.nodes = state.nodes.map((node) =>
                node.id === state.selectedNodeId
                ? {...node, data: {...node.data, label: newLabel}}
                : node
            )
        },
        // Resets the tree to its initial default state.
        resetTree(state){
            state.nodes = initialNodes;
            state.edges = [];
            state.selectedNodeId = null;
            state.highlightedNodeId = null;
        },
    },
});

// Exporting actions for use in components.
export const {
    applyEdgeChangesToState,
    applyNodeChangeToState,
    setTreeState,
    resetTree,
    setSelectedNode,
    setHighlightedNode,
    editNode,
    deleteNode,
} = treeSlice.actions;

// Exporting the reducer for the store.
export default treeSlice.reducer;