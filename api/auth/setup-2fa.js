import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        const adminEmail = "vishal.mall02@outlook.com";
        
        // Check if this specific admin exists
        let admin = await Admin.findOne({ email: adminEmail });
        
        if (admin && admin.twoFactorSecret) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden. 2FA is already setup for vishal.mall02@outlook.com. For security reasons, setup is locked.' 
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
