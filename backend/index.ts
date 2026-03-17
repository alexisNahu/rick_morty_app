import 'dotenv/config';
import express from 'express';
import authRouter from './src/routers/auth.router';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(cookieParser())

app.use(express.json());

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
