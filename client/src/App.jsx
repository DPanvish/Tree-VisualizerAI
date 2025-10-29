import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TreeEditorPage from "./pages/TreeEditorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const App = () => {
    return (
        <div className="h-screen w-screen bg-dark-900">
            <Routes>
                <Route path="/" element={<TreeEditorPage />} />
                <Route path="/login" element={<LoginPage />}/>
                {/* We can add a ProtectedRoute wrapper around TreeEditorPage Later */}
            </Routes>
        </div>
    )
}
export default App
