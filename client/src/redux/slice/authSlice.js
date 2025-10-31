// Importing necessary libraries and components
import {createSlice} from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState = {
    user: {name: 'Guest', email: ""}, // Hold user info
    token: null, // Hold JWT
    isAuthenticated: false,
    isAuthLoading: true,
}

// Creating the auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to set the auth loading state
        setAuthLoading(state, action){
          state.isAuthLoading = action.payload;
        },
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
            state.user = {name: 'Guest', email: ""}
            state.token = null;
            state.isAuthenticated = false;
            state.isAuthLoading = false;
            // remove token from localStorage
            localStorage.removeItem("userToken");
        },
    },
});

// Exporting the actions
export const {setCredentials, logOut, setAuthLoading} = authSlice.actions;
// Exporting the reducer
export default authSlice.reducer;