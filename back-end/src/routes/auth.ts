import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await db.query.users.findFirst({ where: (users) => eq(users.email, email) });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            nom,
            prenom,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await db.query.users.findFirst({ where: (users) => eq(users.email, email) });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: existingUser.id,
                nom: existingUser.nom,
                prenom: existingUser.prenom,
                email: existingUser.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/me', authMiddleware, (req, res) => {
    return res.status(200).json({ user: req.user });
});

export default router;