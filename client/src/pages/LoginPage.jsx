import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-full bg-bg-primary">
            <div className="bg-bg-secondary p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-text-primary text-center mb-6">Login</h2>
                <form className="space-y-4">
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
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Login
                    </button>

                </form>
                <p className="text-sm text-text-secondary text-center mt-4">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/signup")} className="text-accent hover:underline">Sign up</span>
                </p>
            </div>
        </div>
    )
}
export default LoginPage
