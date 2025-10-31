import {configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import treeReducer from "./slice/treeSlice";
import chatReducer from "./slice/chatSlice";

const appReducer = combineReducers({
    auth: authReducer,
    tree: treeReducer,
    chat: chatReducer,
});

const rootReducer = (state, action) => {
    if(action.type === "auth/logOut"){
        return appReducer({auth: state.auth}, action);
    }

    return appReducer(state, action);
}

const store = configureStore({reducer: rootReducer});

export default store;