// Importing the jsonwebtoken library for handling JWTs
import jwt from 'jsonwebtoken';

// Middleware function to authenticate requests using JWT.
const authMiddleware = (req, res, next) => {
    // Get the Authorization header from the request.
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and correctly formatted.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({status: "error", message: "Unauthorized: No token provided"});
    }

    // Extract the token from the "Bearer <token>" format.
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the secret key.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object.
        req.user = decoded;

        // Proceed to the next middleware or route handler.
        next();
    } catch (err) {
        // If the token is invalid or expired, return an error.
        res.status(401).json({status: "error", message: "Invalid token"});
    }
}

// Exporting the middleware to be used in other parts of the application
export default authMiddleware;