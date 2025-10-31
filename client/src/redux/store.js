// Importing necessary libraries and components
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import treeReducer from "./slice/treeSlice";
import chatReducer from "./slice/chatSlice";

// Configuring the redux store
export const store = configureStore({
    reducer:{
        auth: authReducer,
        tree: treeReducer,
        chat: chatReducer,
    },
    // Disabling serializableCheck for now, as React Flow nodes can contain non-serializable data
    // You can configure this more granularly later if needed
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})