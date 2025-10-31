import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import TreeEditorPage from "./pages/TreeEditorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setAuthLoading, logOut } from "./redux/slice/authSlice.js";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");

        // Check if the token is valid and fetch user profile if needed
        if(userToken){
            const fetchUserProfile = async() => {
                try{
                    const config ={
                        headers: {Authorization: `Bearer ${userToken}`}
                    };

                    const response = await axios.get("http://localhost:5000/api/auth/profile", config);

                    if(response.data.status === "success"){
                        dispatch(setCredentials({user: response.data.data.user, token: userToken}));
                    }else{
                        dispatch(logOut());
                    }
                }catch(err){
                    dispatch(logOut());
                }finally {
                    dispatch(setAuthLoading(false));
                }
            };

            fetchUserProfile();

        }else{
            dispatch(setAuthLoading(false));
        }

    }, [dispatch]);

    return (
        <div className="h-screen w-screen bg-bg-primary">
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
                {/* We can add a ProtectedRoute wrapper around TreeEditorPage Later */}
            </Routes>

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
    )
}
export default App
