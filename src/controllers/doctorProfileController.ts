import { Request, Response } from 'express';
import pool from '../config/db';

export const upsertDoctorProfile = async (req: Request, res: Response) => {
    try {
        const {
            doctorId,
            experienceYears,
            email,
            clinicAddress,
            consultationFee,
            profile,
        } = req.body;

        // Use flat fields if available, otherwise fallback to nested profile fields
        const finalExperienceYears = experienceYears ?? profile?.experienceYears;
        const finalEmail = email ?? profile?.email;
        const finalClinicAddress = clinicAddress ?? profile?.clinicAddress;
        const finalConsultationFee = consultationFee ?? profile?.consultationFee;

        if (!doctorId) {
            return res.status(400).json({ error: 'doctorId is required' });
        }

        const query = `
            INSERT INTO "DoctorProfile" ("doctorId", "experienceYears", email, "clinicAddress", "consultationFee", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            ON CONFLICT ("doctorId") DO UPDATE SET
                "experienceYears" = EXCLUDED."experienceYears",
                email = EXCLUDED.email,
                "clinicAddress" = EXCLUDED."clinicAddress",
                "consultationFee" = EXCLUDED."consultationFee",
                "updatedAt" = EXCLUDED."updatedAt"
            RETURNING *;
        `;

        const values = [doctorId, finalExperienceYears, finalEmail, finalClinicAddress, finalConsultationFee];
        const result = await pool.query(query, values);

        res.status(200).json({
            message: 'Profile updated successfully',
            doctorId: result.rows[0].doctorId,
            experienceYears: result.rows[0].experienceYears,
            email: result.rows[0].email,
            clinicAddress: result.rows[0].clinicAddress,
            consultationFee: result.rows[0].consultationFee,
            updatedAt: result.rows[0].updatedAt
        });
    } catch (error) {
        console.error('Error in upsertDoctorProfile:', error);
        res.status(500).json({ error: 'Failed to update doctor profile' });
    }
};

export const getDoctorProfile = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;

        const result = await pool.query('SELECT * FROM "DoctorProfile" WHERE "doctorId" = $1', [doctorId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const row = result.rows[0];
        res.status(200).json({
            doctorId: row.doctorId,
            experienceYears: row.experienceYears,
            email: row.email,
            clinicAddress: row.clinicAddress,
            consultationFee: row.consultationFee,
            updatedAt: row.updatedAt
        });
    } catch (error) {
        console.error('Error in getDoctorProfile:', error);
        res.status(500).json({ error: 'Failed to fetch doctor profile' });
    }
};
