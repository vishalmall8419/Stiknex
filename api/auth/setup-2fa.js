import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        // SECURITY FIX: Only allow setup if NO admin exists in the database.
        // If an admin already exists, someone might be trying to hijack the system.
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden. An admin account already exists. For security reasons, 2FA setup is locked.' 
            });
        }

        const adminEmail = "admin@stiknex.com";
        
        // Generate a new TOTP secret for Microsoft Authenticator
        const secret = speakeasy.generateSecret({ 
            name: 'Stiknex Admin Panel',
            issuer: 'Stiknex' 
        });

        // Create the admin
        const admin = new Admin({
            email: adminEmail,
            role: 'admin',
            twoFactorSecret: secret.base32,
            failedLoginAttempts: 0
        });

        await admin.save();

        // Generate QR code data URL (Base64 image)
        const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.status(200).json({ 
            success: true, 
            message: '2FA Setup Complete. Please scan the QR code with Microsoft Authenticator.',
            secretBase32: secret.base32,
            qrCodeUrl: qrCodeDataUrl
        });

    } catch (error) {
        console.error('Setup 2FA error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
