import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.js';

const app = express();

app.use(express.json()); // indispensable pour lire req.body en JSON

app.get('/', (req, res) => {
    res.send('Islem ');
});

app.use('/auth', authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})