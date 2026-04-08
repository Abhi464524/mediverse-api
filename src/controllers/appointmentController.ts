import { Request, Response } from 'express';
import pool from '../config/db';
import { Appointment, EmergencyAppointment } from '../types';

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const doctor_id = req.query.doctor_id || req.query.doctorId;
        const date = req.query.date;
        const search = req.query.search;

        if (!doctor_id) {
            return res.status(400).json({ success: false, message: 'doctor_id (or doctorId) is required' });
        }

        let query = 'SELECT * FROM "Appointment" WHERE doctor_id = $1 AND is_emergency = FALSE';
        const params: any[] = [doctor_id];

        if (search) {
            // Search ignores date
            query += ' AND ("patient_name" ILIKE $2 OR "phone" ILIKE $2)';
            params.push(`%${search}%`);
        } else if (date) {
            query += ' AND "date" = $2';
            params.push(date);
        }

        const result = await pool.query(query, params);
        
        // Map the results to match the requested JSON format and add camelCase aliases
        const appointments = result.rows.map((row: any) => {
            let formattedDate = null;
            if (row.date) {
                const d = new Date(row.date);
                formattedDate = d.getFullYear() + '-' + 
                                String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(d.getDate()).padStart(2, '0');
            }
            
            return {
                id: row.id,
                doctorId: row.doctor_id,
                doctor_id: row.doctor_id,
                patientName: row.patient_name, // Frontend compatibility alias
                patient_name: row.patient_name,
                phone: row.phone,
                time: row.time,
                date: formattedDate,
                diagnosis: row.diagnosis,
                status: row.status,
                patient: row.patient_data
            };
        });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Error in getAppointments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
    }
};

export const getEmergencyAppointments = async (req: Request, res: Response) => {
    try {
        const doctor_id = req.query.doctor_id || req.query.doctorId;

        if (!doctor_id) {
            return res.status(400).json({ success: false, message: 'doctor_id (or doctorId) is required' });
        }

        const result = await pool.query(
            'SELECT * FROM "Appointment" WHERE doctor_id = $1 AND is_emergency = TRUE ORDER BY "createdAt" DESC',
            [doctor_id]
        );

        // Map results and add camelCase aliases for the frontend
        const emergencies = result.rows.map((row: any) => ({
            id: row.id,
            doctorId: row.doctor_id,
            doctor_id: row.doctor_id,
            patientName: row.patient_name,
            patient_name: row.patient_name,
            time: row.time,
            diagnosis: row.diagnosis,
            severity: row.severity,
            status: row.status,
            createdAt: row.createdAt
        }));

        res.status(200).json({
            success: true,
            data: emergencies
        });
    } catch (error) {
        console.error('Error in getEmergencyAppointments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch emergency appointments' });
    }
};
