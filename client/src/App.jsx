import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TreeEditorPage from "./pages/TreeEditorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

const App = () => {
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
        </div>
    )
}
export default App
