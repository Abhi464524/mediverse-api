import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * Unified controller to Create or Update Doctor Profile
 * Perfectly aligned with the Flutter 3-object JSON structure
 */
export const upsertDoctorProfile = async (req: Request, res: Response) => {
    try {
        const {
            doctorId,
            personalInfo,
            contactDetails,
            clinicDetails
        } = req.body;

        if (!doctorId) {
            return res.status(400).json({ error: 'doctorId is required.' });
        }

        const upsertQuery = `
            INSERT INTO "DoctorProfile" (
                "doctorId", "personalInfo", "contactDetails", "clinicDetails", "updatedAt"
            )
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT ("doctorId") 
            DO UPDATE SET
                "personalInfo" = EXCLUDED."personalInfo",
                "contactDetails" = EXCLUDED."contactDetails",
                "clinicDetails" = EXCLUDED."clinicDetails",
                "updatedAt" = EXCLUDED."updatedAt"
            RETURNING *;
        `;

        const values = [
            doctorId,
            personalInfo,
            contactDetails,
            clinicDetails
        ];

        const result = await pool.query(upsertQuery, values);
        const row = result.rows[0];

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: row
        });
    } catch (error: any) {
        console.error('Error in upsertDoctorProfile:', error);
        res.status(500).json({ 
            error: 'Failed to create or update doctor profile',
            details: error.message
        });
    }
};

// Alias for backward compatibility
export const createOrUpdateDoctorProfile = upsertDoctorProfile;

/**
 * Unified controller to Fetch Doctor Profile
 */
export const getDoctorProfile = async (req: Request, res: Response) => {
    try {
        // Fetch by doctorId from params or query
        const doctorId = req.params.doctorId || req.query.doctorId;

        if (!doctorId) {
            return res.status(400).json({ error: 'doctorId is required' });
        }

        const result = await pool.query('SELECT * FROM "DoctorProfile" WHERE "doctorId" = $1', [doctorId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Doctor profile not found' });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error in getDoctorProfile:', error);
        res.status(500).json({ 
            error: 'Failed to fetch doctor profile',
            details: error.message
        });
    }
};
