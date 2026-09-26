import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

// Using a fallback secret for development. IN PRODUCTION, set JWT_SECRET in Vercel.
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_stiknex_super_secret_key_2026';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        await connectToDatabase();
        
        const { email, totpToken } = req.body;
        
        if (!email || !totpToken) {
            return res.status(400).json({ success: false, message: 'Please provide email and authenticator code.' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin || !admin.twoFactorSecret) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // BRUTE FORCE PROTECTION: Check if account is locked
        if (admin.isLocked) {
            const lockTimeLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
            return res.status(429).json({ 
                success: false, 
                message: `Account temporarily locked due to too many failed attempts. Try again in ${lockTimeLeft} minutes.` 
            });
        }

        // Verify TOTP token
        const isVerified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: totpToken,
            window: 1
        });

        if (!isVerified) {
            // Increment failed attempts
            admin.failedLoginAttempts += 1;
            
            if (admin.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
                admin.lockUntil = Date.now() + LOCK_TIME_MS;
            }
            await admin.save();

            return res.status(401).json({ success: false, message: 'Invalid or expired authenticator code.' });
        }

        // SUCCESS: Reset brute force counters
        admin.failedLoginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();

        // Generate JWT Token (Expires in 12 hours)
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login successful.',
            token: token,
            data: {
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
