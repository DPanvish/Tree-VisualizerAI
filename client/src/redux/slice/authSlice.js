import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null, // Hold user info
    token: null, // Hold JWT
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to set user/token on successful login/signup
        setCredentials(state, action){
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            // set token to localStorage
        },
        // Action to clear user/token on logout
        logOut(state){
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // remove token from localStorage
        },
    },
});

export const {setCredentials, logOut} = authSlice.actions;
export default authSlice.reducer;