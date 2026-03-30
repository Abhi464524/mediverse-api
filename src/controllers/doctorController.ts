import { Request, Response } from 'express';
import pool from '../config/db';

export const createOrUpdateDoctorProfile = async (req: Request, res: Response) => {
    try {
        const { contactDetails, username, role, speciality, personalInfo, clinicDetails, workingHours } = req.body;

        if (!contactDetails || !contactDetails.emailAddress) {
            return res.status(400).json({ error: 'Email address is required in contactDetails' });
        }

        const email = contactDetails.emailAddress;

        // Use PostgreSQL upsert (ON CONFLICT) to create or update the doctor profile
        const upsertQuery = `
            INSERT INTO "Doctor" (email, username, role, speciality, "personalInfo", "contactDetails", "clinicDetails", "workingHours")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (email)
            DO UPDATE SET
                username = EXCLUDED.username,
                role = EXCLUDED.role,
                speciality = EXCLUDED.speciality,
                "personalInfo" = EXCLUDED."personalInfo",
                "contactDetails" = EXCLUDED."contactDetails",
                "clinicDetails" = EXCLUDED."clinicDetails",
                "workingHours" = EXCLUDED."workingHours",
                "updatedAt" = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const values = [
            email,
            username,
            role || 'doctor',
            speciality,
            personalInfo,
            contactDetails,
            clinicDetails,
            workingHours
        ];

        const result = await pool.query(upsertQuery, values);
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in createOrUpdateDoctorProfile:', error);
        res.status(500).json({ error: 'Failed to create or update doctor profile' });
    }
};

export const getDoctorProfile = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email query parameter is required' });
        }

        const result = await pool.query('SELECT * FROM "Doctor" WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in getDoctorProfile:', error);
        res.status(500).json({ error: 'Failed to fetch doctor profile' });
    }
};
