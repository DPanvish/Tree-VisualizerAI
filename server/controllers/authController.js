// Importing necessary libraries and modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../lib/db.js";

// --- User Signup Controller ---
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate input fields
        if (!email || !password || !name) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }

        // Hash the user's password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user in the database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Generate a JWT for the new user
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in one day
        );

        // Remove the password from the user object before sending the response
        delete user.password;
        res.status(201).json({ status: "success", message: "User registered successfully", data: { token, user } });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Registration failed", error: err.message });
    }
};

// --- User Login Controller ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // Generate a JWT for the logged-in user
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove the password from the user object before sending the response
        delete user.password;
        res.status(200).json({ status: "success", message: "Login successful", data: { token, user } });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Login failed", error: err.message });
    }
};

// --- Get User Profile Controller ---
export const getProfile = async (req, res) => {
    try {
        // The user ID is attached to the request object by the authMiddleware
        const userId = req.user.userId;

        // Find the user by their ID
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Remove the password from the user object before sending the response
        delete user.password;
        res.status(200).json({ status: "success", message: "User profile retrieved successfully", data: { user } });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to retrieve user profile", error: err.message });
    }
};