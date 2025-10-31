import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    user: {name: 'Guest', email: ""}, // Hold user info
    token: null, // Hold JWT
    isAuthenticated: false,
    isAuthLoading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
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

export const {setCredentials, logOut, setAuthLoading} = authSlice.actions;
export default authSlice.reducer;