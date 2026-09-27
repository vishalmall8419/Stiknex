import connectToDatabase from './_utils/db.js';
import { verifyAdminToken } from './_utils/auth.js';
import Trend from './_models/Trend.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();

        // 1. Verify Admin Token
        const auth = verifyAdminToken(req);
        if (!auth.valid) {
            return res.status(401).json({ success: false, message: auth.message });
        }

        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ success: false, message: 'ID and status are required' });
        }

        if (!['pending', 'relevant', 'used', 'ignored'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // 2. Update Trend
        const updatedTrend = await Trend.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTrend) {
            return res.status(404).json({ success: false, message: 'Trend not found' });
        }

        res.status(200).json({ success: true, data: updatedTrend });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
