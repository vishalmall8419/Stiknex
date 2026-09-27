import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_stiknex_super_secret_key_2026';

export function verifyAdminToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, message: 'Missing or invalid authorization header.' };
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return { valid: false, message: 'Forbidden. Admin role required.' };
        }
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: 'Invalid or expired token.' };
    }
}
