// Importing necessary libraries and components
import React from 'react'
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// A component that protects routes that require authentication.
const ProtectedRoute = ({children}) => {
    // Get authentication status from the Redux store.
    const {isAuthenticated, isAuthLoading} = useSelector((state) => state.auth);
    const location = useLocation();

    // Show a loading indicator while authentication status is being determined.
    if(isAuthLoading){
        return(
            <div className="flex items-center justify-center h-screen w-screen bg-bg-primary">
                <p className="text-text-primary">Loading...</p>
            </div>
        )
    }

    // If the user is not authenticated, redirect them to the login page.
    if (!isAuthenticated) {
        // The `replace` prop prevents the user from navigating back to the protected route.
        // The `state` prop passes the original location, so we can redirect back after login.
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    // If authenticated, render the child components.
    return children;
}

export default ProtectedRoute