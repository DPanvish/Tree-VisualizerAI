import React from 'react'
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    Cog8ToothIcon,
    MoonIcon,
    SunIcon
} from "@heroicons/react/24/solid/index.js";
import {useTheme} from "../../context/ThemeContext.jsx";

const Navbar = () => {

    const {theme, toggleTheme, toggleSidebar} = useTheme();

    return (
        <nav className="w-full h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-3">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-muted hover:text-light transition-colors"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                {/* Add Logo */}
                {/*<img src={} alt="Logo" className="w-8 h-8" />*/}

                <span className="text-xl font-bold text-light">TreeVisualizer AI</span>
            </div>

            {/*  Right Side Controls: Theme Toggle & User Profile  */}
            <div className="flex items-center space-x-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="text-muted hover:text-light p-2 rounded-full hover:bg-dark-700 transition-colors"
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
                        <span className="text-sm font-medium text-light">User Name</span>
                        <spac className="text-xs text-muted">user@gmail.com</spac>
                    </div>

                    <button className="hidden md:flex items-center space-x-2 text-muted hover:text-light transition-colors">
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>


            </div>
        </nav>
    )
}
export default Navbar
