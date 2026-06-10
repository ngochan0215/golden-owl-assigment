import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import scoresRoute from './routes/scoresRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });

    app.use('/api', scoresRoute);
}

startServer();