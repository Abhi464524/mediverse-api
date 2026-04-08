export interface User {
    id: number;
    userName: string;
    password?: string;
    role: string;
    speciality?: string | null;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DoctorProfile {
    doctorId: number;
    personalInfo: any;
    contactDetails: any;
    clinicDetails: any;
    createdAt?: Date;
    updatedAt: Date | string;
}

export interface Appointment {
    id: string;
    doctor_id: number;
    patient_name: string;
    phone: string;
    time: string;
    date: Date | string;
    diagnosis?: string;
    status: string;
    patient_data: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmergencyAppointment {
    id: string;
    doctor_id: number;
    patient_name: string;
    time: string;
    diagnosis: string;
    severity: string;
    status: string;
    createdAt?: Date;
}

