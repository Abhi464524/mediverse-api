import { Request, Response } from 'express';
import pool from '../config/db';

export const createPrescription = async (req: Request, res: Response) => {
    try {
        const {
            prescriptionId,
            doctorId,
            patientId,
            appointmentId,
            patientName,
            age,
            gender,
            symptoms,
            diagnosis,
            medicines,
            notes,
            createdAt
        } = req.body;

        if (!prescriptionId || !patientName) {
            return res.status(400).json({ success: false, message: 'prescriptionId and patientName are required' });
        }

        const query = `
            INSERT INTO "digital_prescriptions" (
                id, doctor_id, patient_id, appointment_id, patient_name, age, gender, symptoms, diagnosis, medicines, notes, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO UPDATE SET
                doctor_id = EXCLUDED.doctor_id,
                patient_id = EXCLUDED.patient_id,
                appointment_id = EXCLUDED.appointment_id,
                patient_name = EXCLUDED.patient_name,
                age = EXCLUDED.age,
                gender = EXCLUDED.gender,
                symptoms = EXCLUDED.symptoms,
                diagnosis = EXCLUDED.diagnosis,
                medicines = EXCLUDED.medicines,
                notes = EXCLUDED.notes,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const parsedCreatedAt = createdAt ? new Date(createdAt) : new Date();

        // Ensure medicines is a string if it comes as an object/array
        const formattedMedicines = typeof medicines === 'string'
            ? medicines
            : JSON.stringify(medicines || []);

        const params = [
            prescriptionId,
            doctorId || null,
            patientId || null,
            appointmentId || null,
            patientName,
            age || null,
            gender || null,
            symptoms || '',
            diagnosis || '',
            formattedMedicines,
            notes || '',
            parsedCreatedAt
        ];

        const result = await pool.query(query, params);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ success: false, error: 'Failed to create prescription' });
    }
};

export const getPrescriptions = async (req: Request, res: Response) => {
    try {
        const { patientId, appointmentId, page = '1', limit = '10' } = req.query;

        let query = 'SELECT * FROM "digital_prescriptions" WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (patientId) {
            query += ` AND patient_id = $${paramIndex}`;
            params.push(patientId);
            paramIndex++;
        }

        if (appointmentId) {
            query += ` AND appointment_id = $${paramIndex}`;
            params.push(appointmentId);
            paramIndex++;
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limitNum, offset);

        const result = await pool.query(query, params);

        // Map column names back to camelCase for the frontend
        const prescriptions = result.rows.map(row => ({
            prescriptionId: row.id,
            doctorId: row.doctor_id,
            patientId: row.patient_id,
            appointmentId: row.appointment_id,
            patientName: row.patient_name,
            age: row.age,
            gender: row.gender,
            symptoms: row.symptoms,
            diagnosis: row.diagnosis,
            medicines: row.medicines,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));

        res.status(200).json({
            success: true,
            data: prescriptions,
            meta: {
                page: pageNum,
                limit: limitNum,
                count: prescriptions.length
            }
        });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch prescriptions' });
    }
};


