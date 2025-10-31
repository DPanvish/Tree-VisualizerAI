// Importing necessary libraries and components
import React, {createContext, useContext, useEffect, useState} from 'react'

// Creating a context for the theme
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to provide the theme to the application
export const ThemeProvider = ({children}) => {
    // State for the theme and sidebar visibility
    const [theme, setTheme] = useState("dark");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Effect to load theme from localStorage and apply it
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "dark";
        setTheme(storedTheme);
    }, [])

    // Effect to apply theme to the <html> tag
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Functions to toggle theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }

    // Functions to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    }

    // Value to be provided by the context
    const value ={
        theme,
        toggleTheme,
        isSidebarOpen,
        toggleSidebar
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}