import request from 'supertest';
import express from 'express';
import * as jest from 'jest';
import { mockDeep, mockReset } from 'jest-mock-extended';
import authRoutes from '../routes/auth.js';
import prisma from '../lib/db.js';

// Mock the prisma client
jest.mock('../lib/db.js', () => ({
    __esModule: true,
    default: mockDeep(),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeEach(() => {
    mockReset(prisma);
})

describe("POST /api/auth/signup", () => {
    it("Should create a new user and return a token", async() => {
        const newUser = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        // Mock the database response
        prisma.user.findUnique.mockResolvedValue(null); // No existing user
        prisma.user.create.mockResolvedValue({
            id: "123",
            ...newUser,
        });

        const res = await request(app)
            .post('/api/auth/signup')
            .send(newUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("status", "success");
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should return an error if the user already exists", async() => {
        const existingUser = {
            name: "Existing User",
            email: "exisys@example.com",
            passowrd: "password123",
        };

        // Mock the database to find an existing user
        prisma.user.findUnique.mockResolvedValue(existingUser);

        const res = await request(app)
            .post('/api/auth/signup')
            .send(existingUser);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('status', 'error');
        expect(res.body.message).toBe('User already exists');
    })
})