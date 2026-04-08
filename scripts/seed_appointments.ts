import pool from '../src/config/db';

const seedData = async () => {
    // Dynamically fetch the first doctor from the database
    const doctorResult = await pool.query('SELECT id FROM "User" WHERE role = $1 LIMIT 1', ['doctor']);
    
    if (doctorResult.rows.length === 0) {
        console.error('❌ No doctor found in the database. Please sign up a doctor first.');
        pool.end();
        return;
    }
    
    const doctorId = doctorResult.rows[0].id;
    console.log(`👨‍⚕️ Found doctor in DB with ID: ${doctorId}. Seeding appointments for them...`);

    const appointments = [
        {
            id: 'apt_001',
            doctor_id: doctorId,
            patient_name: 'Rahul Sharma',
            phone: '+91 9876543210',
            time: '10:00 AM',
            date: '2026-04-04',
            diagnosis: 'Dermatitis',
            status: 'Scheduled',
            patient_data: {
                patient_id: 'pat_001',
                profile: {
                    name: 'Rahul Sharma',
                    age: '35',
                    gender: 'Male',
                    blood_group: 'O+',
                    weight: '72',
                    height: '175',
                    is_verified: true
                },
                contact: {
                    phone: '+91 9876543210',
                    email: 'rahul@email.com',
                    address: '45 MG Road, Pune'
                },
                medical_history: {
                    history_notes: 'Mild asthma since childhood',
                    current_medications: 'Salbutamol inhaler',
                    allergies: 'Penicillin',
                    last_visit_date: '2026-03-15'
                },
                appointment: {
                    appointment_id: 'apt_001',
                    scheduled_time: '10:00 AM',
                    diagnosis: 'Dermatitis',
                    symptoms: 'Skin rash, itching',
                    status: 'Scheduled'
                },
                records: {
                    doctor_notes: [
                        {
                            note_id: 'note_001',
                            timestamp: '2026-03-15T10:30:00Z',
                            content: 'Patient showing improvement'
                        }
                    ],
                    attachments: [
                        {
                            file_id: 'file_001',
                            name: 'blood_report.pdf',
                            url: 'https://storage.example.com/files/blood_report.pdf',
                            date: '2026-03-15'
                        }
                    ]
                }
            }
        },
        {
            id: 'apt_002',
            doctor_id: doctorId,
            patient_name: 'Pooja Verma',
            phone: '+91 9876543211',
            time: '11:00 AM',
            date: '2026-04-04',
            diagnosis: 'Migraine',
            status: 'Scheduled',
            patient_data: {
                patient_id: 'pat_002',
                profile: {
                    name: 'Pooja Verma',
                    age: '28',
                    gender: 'Female',
                    blood_group: 'B+',
                    weight: '60',
                    height: '165',
                    is_verified: true
                },
                contact: {
                    phone: '+91 9876543211',
                    email: 'pooja@email.com',
                    address: '12 Main Street, Pune'
                },
                medical_history: {
                    history_notes: 'Frequent headaches',
                    current_medications: 'Ibuprofen as needed',
                    allergies: 'None',
                    last_visit_date: '2026-03-20'
                },
                appointment: {
                    appointment_id: 'apt_002',
                    scheduled_time: '11:00 AM',
                    diagnosis: 'Migraine',
                    symptoms: 'Headache, nausea',
                    status: 'Scheduled'
                },
                records: {
                    doctor_notes: [],
                    attachments: []
                }
            }
        },
        {
            id: 'apt_003',
            doctor_id: doctorId,
            patient_name: 'Anil Desai',
            phone: '+91 9876543212',
            time: '02:00 PM',
            date: '2026-04-04',
            diagnosis: 'Hypertension',
            status: 'Done',
            patient_data: {
                patient_id: 'pat_003',
                profile: {
                    name: 'Anil Desai',
                    age: '55',
                    gender: 'Male',
                    blood_group: 'A+',
                    weight: '85',
                    height: '170',
                    is_verified: true
                },
                contact: {
                    phone: '+91 9876543212',
                    email: 'anil@email.com',
                    address: '88 Park Road, Pune'
                },
                medical_history: {
                    history_notes: 'High blood pressure for 5 years',
                    current_medications: 'Amlodipine 5mg',
                    allergies: 'Sulfa drugs',
                    last_visit_date: '2026-02-15'
                },
                appointment: {
                    appointment_id: 'apt_003',
                    scheduled_time: '02:00 PM',
                    diagnosis: 'Hypertension Checkup',
                    symptoms: 'None, regular checkup',
                    status: 'Done'
                },
                records: {
                    doctor_notes: [
                        {
                            note_id: 'note_002',
                            timestamp: '2026-02-15T10:30:00Z',
                            content: 'BP is stable'
                        }
                    ],
                    attachments: []
                }
            }
        },
        {
            id: 'apt_004',
            doctor_id: doctorId,
            patient_name: 'Simran Kaur',
            phone: '+91 9876543213',
            time: '04:00 PM',
            date: '2026-04-04',
            diagnosis: 'Fever',
            status: 'Scheduled',
            patient_data: {
                patient_id: 'pat_004',
                profile: { name: 'Simran Kaur', age: '30', gender: 'Female', blood_group: 'AB+', weight: '65', height: '160', is_verified: true },
                contact: { phone: '+91 9876543213', email: 'simran@email.com', address: 'Market Road, Pune' },
                medical_history: { history_notes: 'None', current_medications: 'None', allergies: 'Dust', last_visit_date: '2025-12-01' },
                appointment: { appointment_id: 'apt_004', scheduled_time: '04:00 PM', diagnosis: 'Fever', symptoms: 'High temperature, chills', status: 'Scheduled' },
                records: { doctor_notes: [], attachments: [] }
            }
        },
        {
            id: 'apt_005',
            doctor_id: doctorId,
            patient_name: 'Raj Patil',
            phone: '+91 9876543214',
            time: '05:30 PM',
            date: '2026-04-04',
            diagnosis: 'Back Pain',
            status: 'Scheduled',
            patient_data: {
                patient_id: 'pat_005',
                profile: { name: 'Raj Patil', age: '45', gender: 'Male', blood_group: 'O-', weight: '80', height: '180', is_verified: true },
                contact: { phone: '+91 9876543214', email: 'raj@email.com', address: 'Shivaji Nagar, Pune' },
                medical_history: { history_notes: 'Slipped disc', current_medications: 'Painkillers', allergies: 'None', last_visit_date: '2026-01-10' },
                appointment: { appointment_id: 'apt_005', scheduled_time: '05:30 PM', diagnosis: 'Back Pain', symptoms: 'Lower back stiffness', status: 'Scheduled' },
                records: { doctor_notes: [], attachments: [] }
            }
        }
    ];

    const emergencies = [
        {
            id: 'emg_001',
            doctor_id: doctorId,
            patient_name: 'Amit Verma',
            time: '09:15 AM',
            diagnosis: 'Chest pain, shortness of breath',
            severity: 'High',
            status: 'Pending'
        },
        {
            id: 'emg_002',
            doctor_id: doctorId,
            patient_name: 'Sneha Patil',
            time: '12:30 PM',
            diagnosis: 'Severe allergic reaction',
            severity: 'Critical',
            status: 'Pending'
        },
        {
            id: 'emg_003',
            doctor_id: doctorId,
            patient_name: 'Vikram Singh',
            time: '04:45 PM',
            diagnosis: 'Accident trauma, bleeding',
            severity: 'Critical',
            status: 'Resolved'
        },
        {
            id: 'emg_004',
            doctor_id: doctorId,
            patient_name: 'Meera Deshmukh',
            time: '06:00 PM',
            diagnosis: 'Asthma Attack',
            severity: 'Critical',
            status: 'Pending'
        },
        {
            id: 'emg_005',
            doctor_id: doctorId,
            patient_name: 'Rohit Sharma',
            time: '08:30 PM',
            diagnosis: 'High Fever, Unconscious',
            severity: 'Critical',
            status: 'Pending'
        }
    ];

    try {
        console.log('🌱 Seeding sample appointments...');

        for (const appt of appointments) {
            await pool.query(
                `INSERT INTO "Appointment" (id, doctor_id, patient_name, phone, time, date, diagnosis, status, patient_data, is_emergency) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE) ON CONFLICT (id) DO NOTHING`,
                [appt.id, appt.doctor_id, appt.patient_name, appt.phone, appt.time, appt.date, appt.diagnosis, appt.status, appt.patient_data]
            );
        }

        for (const emg of emergencies) {
            await pool.query(
                `INSERT INTO "Appointment" (id, doctor_id, patient_name, time, diagnosis, severity, status, is_emergency) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) ON CONFLICT (id) DO NOTHING`,
                [emg.id, emg.doctor_id, emg.patient_name, emg.time, emg.diagnosis, emg.severity, emg.status]
            );
        }

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        pool.end();
    }
};

seedData();
