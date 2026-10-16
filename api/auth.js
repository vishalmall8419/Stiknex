import connectToDatabase from './_utils/db.js';
import Admin from './_models/Admin.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_stiknex_super_secret_key_2026';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const action = req.query.action || (req.url?.includes('setup-2fa') ? 'setup-2fa' : 'login');

    if (action === 'setup-2fa') {
        return handleSetup2FA(req, res);
    }

    return handleLogin(req, res);
}

async function handleSetup2FA(req, res) {
    try {
        await connectToDatabase();
        
        const adminEmail = "vishal.mall02@outlook.com";
        
        // Check if this specific admin exists
        let admin = await Admin.findOne({ email: adminEmail });
        
        if (admin && admin.twoFactorSecret) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden. 2FA is already setup. For security reasons, setup is locked.' 
            });
        }

        // Wipe old admins to avoid conflicts and keep only the owner
        await Admin.deleteMany({ email: { $ne: adminEmail } });

        // Generate a new TOTP secret for Microsoft Authenticator
        const secret = speakeasy.generateSecret({ 
            name: 'Stiknex Admin Panel',
            issuer: 'Stiknex' 
        });

        if (!admin) {
            admin = new Admin({
                email: adminEmail,
                role: 'admin',
                twoFactorSecret: secret.base32,
                failedLoginAttempts: 0
            });
        } else {
            admin.twoFactorSecret = secret.base32;
            admin.failedLoginAttempts = 0;
            admin.lockUntil = undefined;
        }

        await admin.save();

        // Generate QR code data URL (Base64 image)
        const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

        return res.status(200).json({ 
            success: true, 
            message: '2FA Setup Complete. Please scan the QR code with Microsoft Authenticator.',
            secretBase32: secret.base32,
            qrCodeUrl: qrCodeDataUrl
        });

    } catch (error) {
        console.error('Setup 2FA error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function handleLogin(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        await connectToDatabase();
        
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { email, totpToken } = body;
        
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
            admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
            
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

        return res.status(200).json({ 
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
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

