import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();
const router = Router();

// Signup route
router.post("/signup", async (req, res) => {
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
        const hashedPassword = await bcrypt.hash(password, 10);

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
});


// Login route
router.post("/login", async (req, res) => {
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
});

export default router;