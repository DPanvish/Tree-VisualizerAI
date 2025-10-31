// Importing necessary libraries and components
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import {useTheme} from "../context/ThemeContext.jsx";

// Redux Imports
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slice/authSlice.js";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid/index.js";

// LoginPage component
const LoginPage = () => {
    // Hook for navigation
    const navigate = useNavigate();
    // Hook for dispatching redux actions
    const dispatch = useDispatch();
    // Hook for using theme context
    const { theme, toggleTheme } = useTheme();

    // State for email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Function to handle form submission
    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            // Sending a POST request to the login endpoint
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            // If login is successful
            if(response.data.status === "success"){
                toast.success("Login successful!");
                const {user, token} = response.data.data;
                // Dispatching the setCredentials action
                dispatch(setCredentials({user, token}));
                // Storing the token in local storage
                localStorage.setItem("userToken", token);
                console.log("Login successful");
                // Navigating to the home page
                navigate("/");
            }
        }catch(err){
            // Handling login errors
            const message = err.response?.data?.message || "Login failed";
            console.error("Login error:", message);
            toast.error(message);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-full bg-bg-primary">
            <div className="relative flex items-center justify-center h-full bg-bg-primary">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-6 right-6 text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-bg-secondary transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === "light" ? (
                        <MoonIcon className="w-6 h-6" />
                    ) : (
                        <SunIcon className="w-6 h-6" />
                    )}
                </button>
            </div>
            <div className="bg-bg-secondary p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Login</h2>
                {/* Login form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-text-secondary mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            className="w-full bg-bg-primary border border-border-accent rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-text-secondary mb-2"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            className="w-full bg-bg-primary border border-border-accent rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Login
                    </button>

                </form>
                <p className="text-sm text-text-secondary text-center mt-4">
                    Don't have an account?{" "}
                    {/* Link to signup page */}
                    <span onClick={() => navigate("/signup")} className="text-accent hover:underline">Sign up</span>
                </p>
            </div>
        </div>
    )
}
export default LoginPage