import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import doctorRoutes from './routes/doctors';
import userRoutes from './routes/user';
import doctorProfileRoutes from './routes/doctorProfile';

dotenv.config();

import initDB from './db/init';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database and Initialize Tables
connectDB().then(() => initDB());

// Middleware
app.use(express.json()); // This should typically be before other middleware that might need to parse JSON
app.use(helmet());
app.use(cors());


// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctor-profile', doctorProfileRoutes);
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Mediverse Backend is running' });
});

// Start Server
const serverPort = typeof PORT === 'string' ? parseInt(PORT, 10) : Number(PORT);
const serverHost = process.env.HOST || '0.0.0.0';

app.listen(serverPort, serverHost, () => {
    console.log(`✅ Mediverse Backend is running at http://${serverHost}:${serverPort}`);
    if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 Local Tunnel: https://mediverse-api-rathi.loca.lt`);
    }
});

export default app;
