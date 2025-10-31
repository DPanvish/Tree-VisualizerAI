import {createSlice} from "@reduxjs/toolkit";


const initialMessages = [
    {
        id: 1,
        role: "ai",
        content: "Hello! How can I help you build your tree? Try 'create a binary search tree with nodes 5, 3, 8'."
    },
];

const initialState = {
    messages: initialMessages,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
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

export const {addMessage, clearMessages, setMessages } = chatSlice.actions;
export default chatSlice.reducer;