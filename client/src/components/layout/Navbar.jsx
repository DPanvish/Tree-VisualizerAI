import React from 'react'
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    Cog8ToothIcon,
    MoonIcon,
    SunIcon
} from "@heroicons/react/24/solid/index.js";
import {useTheme} from "../../context/ThemeContext.jsx";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/slice/authSlice.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const {theme, toggleTheme, toggleSidebar} = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user} = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logOut());
        localStorage.removeItem("userToken");
        navigate("/login");
    }

    return (
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
                    <img
                        className="w-8 h-8 rounded-full object-cover"
                        src="https://via.placeholder.com/150"
                        alt="User Profile"
                    />
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
    )
}
export default Navbar
