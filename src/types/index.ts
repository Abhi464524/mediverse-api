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

export interface Doctor {
    id: number;
    email: string;
    username: string;
    role: string;
    speciality: string;
    personalInfo: any;
    contactDetails: any;
    clinicDetails: any;
    workingHours: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface DoctorProfile {
    doctorId: number;
    experienceYears: number;
    email: string;
    clinicAddress: string;
    consultationFee: number;
    updatedAt: string;
}

