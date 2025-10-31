import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({status: "error", message: "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user to the request object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({status: "error", message: "Invalid token"});
    }

}

export default authMiddleware;