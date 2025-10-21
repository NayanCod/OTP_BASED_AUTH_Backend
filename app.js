import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/db.js';
import authRoute from './route/authRoute.js';
import cors from 'cors';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));