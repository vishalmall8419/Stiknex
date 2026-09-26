import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import speakeasy from 'speakeasy';

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

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin || !admin.twoFactorSecret) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or 2FA not setup.' });
        }

        // Verify TOTP token from Microsoft Authenticator
        const isVerified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: 'base32',
            token: totpToken,
            window: 1 // allows a tiny bit of time drift (30 seconds before/after)
        });

        if (!isVerified) {
            return res.status(401).json({ success: false, message: 'Invalid or expired authenticator code.' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Login successful.',
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
