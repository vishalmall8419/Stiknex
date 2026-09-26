import connectToDatabase from './utils/db.js';
import Trend from './models/Trend.js';

export default async function handler(req, res) {
    try {
        await connectToDatabase();
        
        // Fetch the 50 most recent relevant trends that haven't been ignored
        const trends = await Trend.find({ status: { $ne: 'ignored' } })
                                  .sort({ date: -1 })
                                  .limit(50);
                                  
        res.status(200).json({ success: true, data: trends });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
