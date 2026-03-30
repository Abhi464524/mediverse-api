import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Mock Authentication Middleware
 * Temporarily allows access for development and testing.
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // For now, allow requests without a token or with any token
    // In production, implement a real JWT verification or similar
    req.user = { uid: 'mock-doctor-id', email: 'doctor@clinic.com' };
    next();
};
