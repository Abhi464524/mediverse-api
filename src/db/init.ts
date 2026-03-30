import pool from '../config/db';

const initDB = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Doctor" (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'doctor',
                speciality VARCHAR(255) NOT NULL,
                "personalInfo" JSONB NOT NULL,
                "contactDetails" JSONB NOT NULL,
                "clinicDetails" JSONB NOT NULL,
                "workingHours" JSONB NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "DoctorProfile" (
                "doctorId" INTEGER PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
                "experienceYears" INTEGER,
                email VARCHAR(255),
                "clinicAddress" TEXT,
                "consultationFee" INTEGER,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS "User" (
                id SERIAL PRIMARY KEY,
                "userName" VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                speciality VARCHAR(255),
                "phoneNumber" VARCHAR(20) UNIQUE,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database tables:', error);
    } finally {
        client.release();
    }
};

export default initDB;
