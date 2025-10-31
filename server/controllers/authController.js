import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from "../lib/db.js";

// Signup route
export const signup =  async (req, res) => {
    try{
        const {email, password, name} = req.body;

        if(!email || !password || !name){
            return res.status(400).json({status: "error", message: "All fields are required"})
        }

        // Check is user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email},
        })

        if(existingUser){
            return res.status(400).json({status: "error", message: "User already exists"})
        }

        // Hash password
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

        // Create a JWT token
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        // Don't send user.password
        delete user.password;
        res.status(201).json({status: "success", message: "User registered successfully", data: {token, user}})

    }catch(err){
        res.status(500).json({status: "error", message: "Registration failed", error: err.message})
    }
};


// Login route
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if(!user){
            return res.status(401).json({status: "error", message: "Invalid credentials"});
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({status: "error", message: "Invalid credentials"});
        }

        // Create a JWT token
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        // Don't send the password back
        delete user.password;
        res.status(200).json({status: "success", message: "Login successful", data: {token, user}})
    }catch(err){
        res.status(500).json({status: "error", message: "Login failed", error: err.message})
    }
};


// Get user profile route
export const getProfile = async(req, res) => {
    try{
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: {id: userId},
        });

        if(!user){
            return res.status(404).json({status: "error", message: "User not found"});
        }

        delete user.password;
        res.status(200).json({status: "success", message: "User profile retrieved successfully", data: {user}});
    }catch(err){
        res.status(500).json({status: "error", message: "Failed to retrieve user profile", error: err.message});
    }
}