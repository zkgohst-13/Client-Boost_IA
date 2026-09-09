import jwt from "jsonwebtoken";
import type{ Request, Response, NextFunction } from "express";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // le header est du genre "Bearer eyJhbGciOi..."
    // comment tu récupères juste le token, sans le mot "Bearer" ?
    const token = authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};