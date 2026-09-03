import express from 'express';
import authRouter from './routers/auth.router';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(cookieParser())

app.use(express.json());

app.use('/auth', authRouter);
