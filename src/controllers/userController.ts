import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { User } from '../types';
import { auth } from '../config/firebase';

const normalizePhone = (phone: string | undefined): string | null => {
    if (!phone) return null;
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's a 10-digit number, assume India (+91)
    if (digits.length === 10) {
        return `+91${digits}`;
    }
    
    // If it's 12 digits and starts with 91, it's likely an Indian number with country code but no +
    if (digits.length === 12 && digits.startsWith('91')) {
        return `+${digits}`;
    }
    
    // For anything else, just prepend + if it was intended as a full international number
    return phone.startsWith('+') ? phone : `+${digits}`;
};
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, password, role, speciality, phoneNumber: rawPhoneNumber } = req.body;
        const phoneNumber = normalizePhone(rawPhoneNumber);

        if (!userName || !password) {
            return res.status(400).json({ error: 'userName and password are required' });
        }

        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM "User" WHERE "userName" = $1 OR "phoneNumber" = $2', [userName, phoneNumber]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User with this userName or phoneNumber already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const assignedRole = role || 'user';
        const assignedSpeciality = assignedRole === 'doctor' ? speciality : null;

        // Create user
        const result = await pool.query(
            'INSERT INTO "User" ("userName", password, role, speciality, "phoneNumber") VALUES ($1, $2, $3, $4, $5) RETURNING id, "userName", role, speciality, "phoneNumber", "createdAt", "updatedAt"',
            [userName, hashedPassword, assignedRole, assignedSpeciality, phoneNumber]
        );

        const newUser: any = result.rows[0];
        
        // Add aliases for frontend compatibility
        const enhancedUser = {
            ...newUser,
            username: newUser.userName,
            specialization: newUser.speciality
        };
        
        res.status(201).json(enhancedUser);
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { userName, phoneNumber: rawPhoneNumber, password } = req.body;
        const phoneNumber = normalizePhone(rawPhoneNumber);

        if ((!userName && !phoneNumber) || !password) {
            return res.status(400).json({ error: 'userName/phoneNumber and password are required' });
        }

        // Find user by userName or phoneNumber
        const result = await pool.query(
            'SELECT * FROM "User" WHERE "userName" = $1 OR "phoneNumber" = $2',
            [userName || null, phoneNumber || null]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Account not found',
                message: 'user doesnot exist Signup first' 
            });
        }

        const user = result.rows[0];

        // Check if role matches if provided in request
        const requestedRole = req.body.role;
        if (requestedRole && user.role !== requestedRole) {
            return res.status(401).json({ 
                error: 'Role mismatch', 
                message: `This account is registered as a ${user.role}, but you are trying to log in as a ${requestedRole}.` 
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Don't return the password
        const { password: _, ...userWithoutPassword } = user;
        
        // Add aliases for frontend compatibility
        const enhancedUser = {
            ...userWithoutPassword,
            username: user.userName,
            specialization: user.speciality
        };
        
        res.status(200).json({ 
            message: 'Login successful', 
            user: enhancedUser,
            loginMethod: 'credential' 
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

export const loginByPhone = async (req: Request, res: Response) => {
    try {
        const { firebaseIdToken } = req.body;

        if (!auth) {
            return res.status(503).json({ error: 'Firebase authentication is not configured on the server' });
        }

        if (!firebaseIdToken) {
            return res.status(400).json({ error: 'firebaseIdToken is required' });
        }

        // Verify the Firebase ID token
        const decodedToken = await auth.verifyIdToken(firebaseIdToken);
        const phoneNumber = normalizePhone(decodedToken.phone_number);

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Invalid token: No phone number found' });
        }

        // Find user by phoneNumber in our database
        // Note: phoneNumber in Firebase typically starts with '+'
        const result = await pool.query('SELECT * FROM "User" WHERE "phoneNumber" = $1', [phoneNumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Account not found', 
                phoneNumber,
                message: 'user doesnot exist Signup first' 
            });
        }

        const user = result.rows[0];

        // Check if role matches if provided in request
        const requestedRole = req.body.role;
        if (requestedRole && user.role !== requestedRole) {
            return res.status(401).json({ 
                error: 'Role mismatch', 
                message: `This account is registered as a ${user.role}, but you are trying to log in as a ${requestedRole}.` 
            });
        }

        // Don't return the password
        const { password: _, ...userWithoutPassword } = user;
        
        // Add aliases for frontend compatibility
        const enhancedUser = {
            ...userWithoutPassword,
            username: user.userName,
            specialization: user.speciality
        };

        res.status(200).json({ 
            message: 'Login successful', 
            user: enhancedUser,
            loginMethod: 'phone'
        });
    } catch (error) {
        console.error('Error in loginByPhone:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
