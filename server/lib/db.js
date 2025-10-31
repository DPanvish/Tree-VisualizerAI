// Importing the PrismaClient from the @prisma/client package
import { PrismaClient } from '@prisma/client';

// Creating a new instance of the PrismaClient
const prisma = new PrismaClient();

// Exporting the prisma instance to be used in other parts of the application
export default prisma;