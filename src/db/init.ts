import pool from '../config/db';

const initDB = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS "DoctorProfile" (
                "doctorId" INTEGER PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
                "personalInfo" JSONB,
                "contactDetails" JSONB,
                "clinicDetails" JSONB,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

            CREATE TABLE IF NOT EXISTS "Appointment" (
                id VARCHAR(50) PRIMARY KEY,
                "doctor_id" INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
                "patient_name" VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                time VARCHAR(20) NOT NULL,
                date DATE,
                diagnosis TEXT,
                severity VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Scheduled',
                "is_emergency" BOOLEAN DEFAULT FALSE,
                "patient_data" JSONB,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "digital_prescriptions" (
                id VARCHAR(50) PRIMARY KEY,
                doctor_id INTEGER REFERENCES "User"(id) ON DELETE SET NULL,
                patient_id INTEGER,
                appointment_id VARCHAR(50) REFERENCES "Appointment"(id) ON DELETE SET NULL,
                patient_name VARCHAR(255) NOT NULL,
                age INTEGER,
                gender VARCHAR(20),
                symptoms TEXT,
                diagnosis TEXT,
                medicines TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS "idx_digital_prescriptions_patient_id" ON "digital_prescriptions" (patient_id);
            CREATE INDEX IF NOT EXISTS "idx_digital_prescriptions_appointment_id" ON "digital_prescriptions" (appointment_id);
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database tables:', error);
    } finally {
        client.release();
    }
};

export default initDB;
