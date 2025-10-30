import React from 'react'
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    // Get the user token from the Redux store
    const {isAuthenticated} = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        // "replace" stops the user from pressing "back" to get into the app
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    // If authenticated, render the children components
    return children;
}

export default ProtectedRoute
