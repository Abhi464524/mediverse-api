import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import os from 'os';
import { connectDB } from './config/db';
import initDB from './db/init';
import doctorRoutes from './routes/doctors';
import userRoutes from './routes/user';
import doctorProfileRoutes from './routes/doctorProfile';
import appointmentRoutes from './routes/appointmentRoutes';

// Load environment variables once at the start
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Proxy (Essential for localtunnel and production proxies like Nginx/ALB)
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier dev with localtunnel
}));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctor-profile', doctorProfileRoutes);
app.use('/api/doctor', appointmentRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Mediverse Backend is running' });
});

/**
 * Robust Startup Function
 */
const startServer = async () => {
    try {
        console.log('🔄 Starting Mediverse Backend...');
        
        // 1. Connect to Database
        await connectDB();
        
        // 2. Initialize Tables
        await initDB();
        
        // 3. Start Express Server
        const serverPort = typeof PORT === 'string' ? parseInt(PORT, 10) : Number(PORT);
        const serverHost = process.env.HOST || '0.0.0.0';

        const server = app.listen(serverPort, serverHost, () => {
            // Get Local IP Address for easier mobile testing
            const networkInterfaces = os.networkInterfaces();
            let localIp = 'localhost';
            
            for (const interfaceName in networkInterfaces) {
                const interfaces = networkInterfaces[interfaceName];
                if (interfaces) {
                    for (const iface of interfaces) {
                        if (iface.family === 'IPv4' && !iface.internal) {
                            localIp = iface.address;
                            break;
                        }
                    }
                }
                if (localIp !== 'localhost') break;
            }

            console.log(`✅ Mediverse Backend is running at http://${serverHost}:${serverPort}`);
            console.log(`📱 Direct Local IP (Same WiFi): http://${localIp}:${serverPort}`);
        });

        // Server Error Handling
        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${serverPort} is already in use.`);
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Initiate Startup
startServer();

export default app;
