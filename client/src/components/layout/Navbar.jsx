import React, { useState } from 'react'
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    MoonIcon,
    SunIcon,
    FolderArrowDownIcon,
} from "@heroicons/react/24/solid/index.js";
import { useTheme } from "../../context/ThemeContext.jsx"
import axios from "axios";
import { toast } from "react-toastify";
import LoadSessionModal from "../common/LoadSessionModal.jsx";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/slice/authSlice.js";
import { useNavigate } from "react-router-dom";
import {ArrowDownTrayIcon} from "@heroicons/react/24/outline/index.js";

const Navbar = () => {

    const {theme, toggleTheme, toggleSidebar} = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {user, token} = useSelector((state) => state.auth);
    const {nodes, edges} = useSelector((state) => state.tree);
    const {messages} = useSelector((state) => state.chat);

    const handleLogout = () => {
        dispatch(logOut());
        localStorage.removeItem("userToken");
        navigate("/login");
    }

    const handleSave = async() => {
        const sessionName = prompt("Enter a name for your session:");
        if(!sessionName){
            toast.info("Save operation cancelled");
            return;
        }

        try{

            // Data to be sent to the server
            const sessionData = {
                name: sessionName,
                nodes: nodes,
                edges: edges,
                chatMessages: messages
            };

            // auth headers
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post("http://localhost:5000/api/sessions", sessionData, config);

            if(response.data.status === "success"){
                toast.success("Toast Session saved successfully!");
            }else{
                toast.error("Failed to save session");
            }
        }catch(err){
            const message = err.response?.data?.message || "Failed to save session";
            console.error("Error saving session:", message);
            toast.error(message);
        }
    };

    const handleLoad = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <nav className="w-full h-16 bg-bg-secondary border-b border-border-accent flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-muted hover:text-text-primary transition-colors"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    {/* Add Logo */}
                    {/*<img src={} alt="Logo" className="w-8 h-8" />*/}

                    <span className="text-xl font-bold text-text-primary">TreeVisualizer AI</span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Save Tree</span>
                    </button>

                    <button
                        onClick={handleLoad}
                        className="flex items-center space-x-2 bg-bg-primary hover:bg-bg-secondary text-text-primary font-medium py-2 px-3 rounded-lg border border-border-accent text-sm transition-colors"
                    >
                        <FolderArrowDownIcon className="w-5 h-5" />
                        <span>Load Tree</span>
                    </button>
                </div>

                {/*  Right Side Controls: Theme Toggle & User Profile  */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-bg-primary transition-colors"
                    >
                        {theme === "light" ? (
                            <MoonIcon className="w-5 h-5" />
                        ) : (
                            <SunIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* User Profile & Logout */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden md:flex flex-col text-right">
                        <span className="text-sm font-medium text-text-primary">
                            {user ? user.name : "Guest"}
                        </span>
                            <span className="text-xs text-text-secondary">
                            {user ? user.email : ""}
                        </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>


                </div>
            </nav>

            <LoadSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
export default Navbar
