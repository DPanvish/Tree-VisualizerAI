// Importing necessary libraries and components
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TreeEditorPage from "./pages/TreeEditorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Redux imports
import { setTreeState } from "./redux/slice/treeSlice.js";
import { setMessages } from "./redux/slice/chatSlice.js";
import { useDispatch } from "react-redux";
import { setCredentials, setAuthLoading, logOut } from "./redux/slice/authSlice.js";

// The main application component that sets up routing and handles initial auth state.
const App = () => {
    const dispatch = useDispatch();

    // This effect runs on initial application load to check for an existing user session.
    useEffect(() => {
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
            const fetchUserProfile = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userToken}` } };

                    // Verify token and fetch user profile.
                    const profileResponse = await axios.get("http://localhost:5000/api/auth/profile", config);

                    if (profileResponse.data.status === "success") {
                        const user = profileResponse.data.data.user;
                        dispatch(setCredentials({ user, token: userToken }));

                        // Fetch the user's most recent session.
                        const sessionResponse = await axios.get("http://localhost:5000/api/sessions/latest", config);
                        if (sessionResponse.data.status === "success") {
                            const { session } = sessionResponse.data.data;
                            if (session) {
                                // Load the tree and chat history from the latest session.
                                dispatch(setTreeState({ nodes: session.nodes, edges: session.edges }));
                                dispatch(setMessages(session.chatHistory?.messages || []));
                            }
                        }
                    } else {
                        // If token is invalid, log the user out.
                        dispatch(logOut());
                    }
                } catch (err) {
                    // On any error (e.g., network, expired token), log out.
                    dispatch(logOut());
                } finally {
                    // Stop the initial loading state.
                    dispatch(setAuthLoading(false));
                }
            };

            fetchUserProfile();
        } else {
            // If no token is found, just stop the loading state.
            dispatch(setAuthLoading(false));
        }
    }, [dispatch]);

    return (
        <div className="h-screen w-screen bg-bg-primary">
            {/* Application-level routing */}
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <TreeEditorPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>

            {/* Global toast notification container */}
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default App;