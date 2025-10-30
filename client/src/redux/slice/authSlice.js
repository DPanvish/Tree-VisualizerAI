import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null, // Hold user info
    token: localStorage.getItem("userToken"), // Hold JWT
    isAuthenticated: !!localStorage.getItem("userToken"),
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
            localStorage.setItem("userToken", token);
        },
        // Action to clear user/token on logout
        logOut(state){
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // remove token from localStorage
            localStorage.removeItem("userToken");
        },
    },
});

export const {setCredentials, logOut} = authSlice.actions;
export default authSlice.reducer;