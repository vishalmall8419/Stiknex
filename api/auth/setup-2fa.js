import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        const adminEmail = "admin@stiknex.com";
        
        // Find existing admin or create a new one
        let admin = await Admin.findOne({ email: adminEmail });
        
        if (!admin) {
            // If the user hasn't run the original setup script, create the admin
            admin = new Admin({
                email: adminEmail,
                role: 'admin'
            });
        }

        // Generate a new TOTP secret for Microsoft Authenticator
        const secret = speakeasy.generateSecret({ 
            name: 'Stiknex Admin Panel',
            issuer: 'Stiknex' 
        });

        // Save secret to database
        admin.twoFactorSecret = secret.base32;
        await admin.save();

        // Generate QR code data URL (Base64 image)
        const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.status(200).json({ 
            success: true, 
            message: '2FA Setup Complete. Please scan the QR code with Microsoft Authenticator.',
            secretBase32: secret.base32, // For manual entry if needed
            qrCodeUrl: qrCodeDataUrl
        });

    } catch (error) {
        console.error('Setup 2FA error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
