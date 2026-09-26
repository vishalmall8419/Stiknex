import connectToDatabase from '../utils/db.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

// NOTE: This endpoint should be DELETED or PROTECTED after first use in production!
export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        const adminEmail = "admin@stiknex.com";
        const adminPassword = "StiknexPassword@123";

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            return res.status(200).json({ success: true, message: 'Admin already exists!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create the admin
        const newAdmin = new Admin({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({ 
            success: true, 
            message: `Admin created successfully. Email: ${adminEmail} | Password: ${adminPassword}` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
