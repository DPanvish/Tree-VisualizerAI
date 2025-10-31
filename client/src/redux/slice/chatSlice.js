// Importing necessary libraries and components
import {createSlice} from "@reduxjs/toolkit";

// Initial messages for the chat
const initialMessages = [
    {
        id: 1,
        role: "ai",
        content: "Hello! How can I help you build your tree? Try 'create a binary search tree with nodes 5, 3, 8'."
    },
];

// Initial state for the chat slice
const initialState = {
    messages: initialMessages,
};

// Creating the chat slice
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        // Action to set the messages
        setMessages(state, action){
            state.messages = action.payload;
        },
        // Adds a new message (from user to AI) to the list
        addMessage(state, action){
            // action.payload should be a new message object {id, role, content}
            state.messages.push(action.payload);
        },
        // Clears the chat messages
        clearMessages(state){
            state.messages = initialMessages;
        },
    },
});

// Exporting the actions
export const {addMessage, clearMessages, setMessages } = chatSlice.actions;
// Exporting the reducer
export default chatSlice.reducer;